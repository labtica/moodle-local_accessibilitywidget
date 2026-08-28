# Plugin de accesibilidad para Moodle: `local_accessibilitywidget`

Guía de implementación, integración y pruebas para convertir el script `a11y-widget.js`
en un plugin estándar de Moodle 4.x cuyo frontend está construido con React dentro de `_client`.

> Estado: **documento de planificación**. Aún no se ha generado el código del plugin.
> Este archivo describe paso a paso cómo se integra el script y cómo se prueba en Moodle.

---

## 1. Objetivo y alcance

Encapsular el widget de accesibilidad existente (`a11y-widget.js`) dentro de un plugin Moodle
instalable y activable como cualquier otro, sin perder **ninguna** funcionalidad del script original:

- Perfiles de accesibilidad (motora, ceguera, daltonismo, dislexia, visión baja, cognitivo, epilepsia, TDAH).
- Lectura por voz al hacer clic (TTS) con ritmos normal/rápido/lento y feedback hablado.
- Subtítulos automáticos (CC): vía archivos VTT (`sidecar` o `<track>`) y, como respaldo, reconocimiento de voz.
- Máscara de lectura.
- Ajustes de tipografía (tamaño, interletrado, alineación), contraste/tema y saturación.
- Cursor grande, reducción de animaciones y modo apto para dislexia.
- Persistencia de preferencias en `localStorage`.

Todo el frontend se reescribe en **React + TypeScript + Vite** dentro de la carpeta `_client`.

---

## 2. Decisiones de diseño

- **Tipo de plugin: `local`** (`local/accessibilitywidget`). El widget es flotante y global (aparece en todas las
  páginas), por lo que el patrón correcto es un plugin `local` que inyecta el widget en el footer mediante
  el sistema de *hooks* de Moodle 4.x. Es el mismo mecanismo que ya usa el plugin `local/accessibility`
  presente en este Moodle.
- **Nombre `local_accessibilitywidget`**: se evita el nombre `accessibility` porque ya existe `local/accessibility`
  (plugin de terceros) y habría colisión.
- **React montado en Shadow DOM**: el FAB y el panel se montan dentro de un *shadow root* para aislar los
  estilos del widget respecto del tema de Moodle (tal como hace el script original). La CSS que actúa sobre
  `<html>` (atributos `data-a11y-*`) se inyecta en `document.head`.
- **Persistencia en `localStorage`** (clave `a11y-widget:v1`), idéntica al original. No se crean tablas de BD.
- **Build con nombres de salida fijos** (`a11y-widget.js` / `a11y-widget.css`) para que las rutas en PHP no
  cambien entre compilaciones. La carpeta `dist/` se versiona en git para que el plugin sea instalable sin
  necesidad de Node en el servidor de producción.

---

## 3. Estructura de carpetas

```text
local/accessibilitywidget/
  version.php                          # Metadatos del plugin (component = local_accessibilitywidget, requires 4.x)
  settings.php                         # Ajustes admin: habilitar, idioma por defecto, zIndex
  lib.php                              # Helpers PHP (lectura de config / rutas del build)
  plugin-plan.md                       # Este documento

  db/
    hooks.php                          # Registra el callback del hook de footer

  classes/
    hooks/output/
      before_footer_html_generation.php  # Inyecta el root + config y encola JS/CSS del build
    privacy/
      provider.php                     # Null provider (solo se usa localStorage del navegador)

  templates/
    widget.mustache                    # <div id="a11y-widget-host"> + JSON de configuración

  lang/
    en/local_accessibilitywidget.php
    es/local_accessibilitywidget.php

  pix/
    icon.svg                           # Icono del plugin

  fonts/opendyslexic/                  # Verdana*.ttf usadas por el modo "apto para dislexia"

  _client/                             # FRONTEND REACT (código fuente)
    package.json
    vite.config.ts
    tsconfig.json  tsconfig.app.json  tsconfig.node.json
    index.html                         # Solo para desarrollo/HMR
    .eslintrc.cjs
    src/
      main.tsx                         # Crea host + shadow root y monta <App/>
      app.tsx                          # Orquesta estado, efectos y UI
      i18n.ts                          # Diccionario es/en (portado de I18N)
      constants.ts                     # FONT_STEPS, THEMES, PROFILES, etc.
      types.ts                         # A11yState, A11yConfig
      styles/
        shadow-css.ts                  # CSS del shadow DOM (fab, panel, opt, profiles)
        global-css.ts                  # CSS de atributos data-a11y-* sobre <html>
      state/
        useA11yState.ts                # Estado + persistencia + reset + aplicar perfil
      effects/
        useDocumentEffects.ts          # Atributos data-a11y-* + fallback de escalado de fuente
        useReadingMask.ts              # Overlay de máscara de lectura
        useSpeech.ts                   # TTS "leer al hacer clic"
        useAutoCaptions.ts             # CC: VTT + reconocimiento de voz
      components/
        Launcher.tsx                   # Botón flotante (FAB)
        Panel.tsx                      # Panel lateral (trap de foco + Escape)
        Backdrop.tsx
        ProfilesSection.tsx
        ProfileButton.tsx
        OptionCard.tsx
        Icons.tsx                      # SVGs (persona, campos y perfiles)
    dist/                              # BUILD generado (versionado en git)
      assets/a11y-widget.js
      assets/a11y-widget.css
```

---

## 4. Integración del script dentro del plugin (paso a paso)

### 4.1. Inyección global (equivalente al IIFE + `DOMContentLoaded` del original)

1. **`db/hooks.php`** registra un callback sobre `\core\hook\output\before_footer_html_generation`
   (disponible en Moodle 4.3+; confirmado por el uso existente en
   `local/accessibility/classes/hooks/output/before_footer_html_generation.php`).
2. **`classes/hooks/output/before_footer_html_generation.php`**:
   - Comprueba el ajuste de habilitación de `settings.php`; si está desactivado, no hace nada.
   - Renderiza `templates/widget.mustache`, que imprime:
     - `<div id="a11y-widget-host"></div>` (punto de montaje).
     - `<script type="application/json" id="a11y-widget-config">…</script>` con `lang`, `storageKey`,
       `zIndex` y `assetBaseUrl` (URL pública a `local/accessibilitywidget/fonts/…`).
   - Encola los assets del build:
     - `$PAGE->requires->js(new moodle_url('/local/accessibilitywidget/_client/dist/assets/a11y-widget.js'), true);`
     - `$PAGE->requires->css(new moodle_url('/local/accessibilitywidget/_client/dist/assets/a11y-widget.css'));`
   - Esto sustituye al `<script src="…a11y-widget.js">` que cargaba el script original.

### 4.2. Mapeo de funcionalidades del script a React

| Funcionalidad original (en `a11y-widget.js`)                                   | Implementación en React (`_client/src`)                            |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `defaultState`, `loadState`, `saveState`, validaciones de estado              | `state/useA11yState.ts` (`useState` + `useEffect` -> `localStorage`) |
| `applyToDocument`, `applyFontScaleFallback`, `GLOBAL_CSS`                      | `effects/useDocumentEffects.ts` + `styles/global-css.ts`           |
| `ACCESSIBILITY_PROFILES`, `applyProfileToState`, `getProfileByKey`            | `constants.ts` + acción `applyProfile` del estado                  |
| `cycleFieldValue`, `getFieldValueLabel`, `getFieldIconSvg`, `isFieldActive`   | `components/OptionCard.tsx` + helpers en `constants.ts`            |
| `speakText`, `splitSpeakChunks`, `getSpeechRate`, listener `click`, `Escape`  | `effects/useSpeech.ts`                                              |
| Bloque CC completo (VTT + `textTracks` + `SpeechRecognition` + observer)      | `effects/useAutoCaptions.ts`                                       |
| `ensureReadingMaskOverlay`, `setReadingMaskPosition`, listeners mouse/resize  | `effects/useReadingMask.ts`                                        |
| `init`, `attachShadow`, `shadowCss`, trap de foco, `setOpen`                  | `main.tsx` + `components/Panel.tsx` + `styles/shadow-css.ts`       |
| `I18N`, `t`                                                                    | `i18n.ts` (idioma desde la config inyectada por Moodle)            |
| `iconPerson`, `getFieldIconSvg`, `getProfileIconSvg`                          | `components/Icons.tsx`                                              |

Notas de fidelidad funcional:

- **TTS "leer al hacer clic"**: conserva la marca `data-a11y-reading-active`, los ritmos
  normal/rápido/lento, el feedback hablado al cambiar de modo, el corte con `Escape` y el aviso
  `ttsUnsupported` si el navegador no soporta `speechSynthesis`.
- **Subtítulos automáticos**: se mantienen los dos modos del original:
  1. **VTT**: `sidecar` (`*.es.vtt`, `*.vtt`), elementos `<track>` y `textTracks` ya cargados.
  2. **Reconocimiento de voz** (`SpeechRecognition` / `webkitSpeechRecognition`) como respaldo.
  Incluye el `MutationObserver` para detectar `<audio>`/`<video>` añadidos dinámicamente.
- **Escalado de fuente**: se replica el *fallback* que captura el tamaño base en
  `data-a11y-base-font-size` para evitar acumulación al escalar.

### 4.3. Build estable para Moodle

- `vite.config.ts` usa `@vitejs/plugin-react` y configura
  `build.rollupOptions.output` para emitir **nombres fijos** (`a11y-widget.js`, `a11y-widget.css`),
  evitando los hashes que obligarían a actualizar las rutas en PHP tras cada compilación.
- La carpeta `dist/` se versiona para que el plugin funcione sin Node en producción.

### 4.4. Ajustes y multilenguaje

- **`settings.php`**: casilla de habilitación global, selector de idioma por defecto (auto/es/en) y `zIndex`.
- **`lang/es`, `lang/en`**: `pluginname` y strings de los ajustes. Las cadenas de la **UI del widget** viven
  en `i18n.ts` (igual que el original), para no acoplar el frontend al sistema de strings de Moodle.

---

## 5. Compilación del frontend

Requisitos: Node 18+ y npm.

```bash
cd local/accessibilitywidget/_client
npm install
npm run build      # genera dist/assets/a11y-widget.js y a11y-widget.css
```

Desarrollo con recarga en caliente (fuera de Moodle, usando el `index.html` de pruebas):

```bash
npm run dev
```

Linting del frontend:

```bash
npm run lint
```

---

## 6. Instalación y activación en Moodle

1. Copiar la carpeta del plugin a `local/accessibilitywidget` dentro del Moodle.
2. Asegurarse de que `dist/` está compilada (paso 5).
3. Ejecutar la instalación:
   - Vía web: **Administración del sitio → Notificaciones** (Moodle detecta el nuevo plugin).
   - O por CLI: `php admin/cli/upgrade.php`.
4. Activar/configurar en:
   **Administración del sitio → Extensiones → Local → Accesibilidad (widget)** (`settings.php`).

---

## 7. Plan de pruebas

### 7.1. Verificación básica
- El botón flotante (FAB) aparece en todas las páginas (portada, curso, perfil, etc.).
- Al pulsarlo se abre el panel lateral; se cierra con el botón, el *backdrop* o `Escape`.
- El foco queda atrapado dentro del panel mientras está abierto (navegación con `Tab`).

### 7.2. Ajustes visuales
- **Tema**: Predeterminado → Alto contraste → Invertir.
- **Saturación**: Predeterminado → Baja → Alta → Desaturar.
- **Tamaño de texto** (x1–x4), **interletrado** (normal/amplio), **alineación** (inicio/centro/justificado).
- **Cursor grande**, **reducir animaciones**, **apto para dislexia** (verificar fuente Verdana si está disponible).

### 7.3. Perfiles
- Activar cada perfil y comprobar que aplica exactamente los ajustes definidos (p. ej. *Visión baja* =
  reduce-motion + fontStep 1 + cursor grande + saturación alta). Re-pulsar el perfil activo lo restablece.

### 7.4. Lectura por voz (TTS)
- Activar "leer al hacer clic"; hacer clic sobre un párrafo y confirmar que se lee.
- Cambiar ritmo (normal/rápido/lento) y oír el feedback hablado.
- Pulsar `Escape` para detener y desactivar.
- En navegador sin `speechSynthesis`, comprobar el aviso `ttsUnsupported`.

### 7.5. Subtítulos automáticos (CC)
- Página con `<video>` y `<track kind="subtitles" src="...vtt">`: al reproducir aparecen subtítulos desde VTT.
- Vídeo con `*.es.vtt`/`*.vtt` *sidecar*: se cargan automáticamente.
- Sin VTT y con micrófono permitido: se usa reconocimiento de voz como respaldo.
- En navegador sin soporte, comprobar el aviso `ccUnsupported`.

### 7.6. Máscara de lectura
- Activar y mover el ratón: la banda transparente sigue el cursor; al redimensionar la ventana se reajusta.

### 7.7. Persistencia
- Configurar varias opciones, recargar la página y confirmar que se mantienen (clave `a11y-widget:v1` en
  `localStorage`).

### 7.8. Estándares y regresión
- `phpcs` (Moodle Coding Style) sobre el PHP del plugin.
- `eslint` sobre `_client`.
- Verificar que no hay conflicto con el plugin existente `local/accessibility`.

---

## 8. Compatibilidad

- **Moodle 4.x** (4.3+ para el sistema de *hooks* `\core\hook\output\before_footer_html_generation`).
- Navegadores modernos. Las APIs `speechSynthesis` y `SpeechRecognition` degradan con avisos cuando no están
  disponibles, sin romper el resto del widget.

---

## 9. Entregables y siguientes pasos

1. Este `plugin-plan.md` (estructura, integración y pruebas).
2. Implementación del esqueleto PHP del plugin (`version.php`, `db/hooks.php`, hook de footer, `settings.php`,
   `lang`, `templates`).
3. Implementación del frontend React en `_client` y su build en `dist/`.
4. Pruebas según la sección 7.
