
(function (global) {
  'use strict';

  var A11Y_WIDGET_SCRIPT_SRC = '';
  try {
    var __a11yCur = document.currentScript;
    if (__a11yCur) {
      var __a11ySrc = __a11yCur.getAttribute('src');
      if (__a11ySrc) A11Y_WIDGET_SCRIPT_SRC = __a11ySrc;
    }
  } catch (e) {}

  var PREFIX = 'data-a11y-';
  var STORAGE_KEY = 'a11y-widget:v1';

  var I18N = {
    es: {
      title: 'Accesibilidad',
      close: 'Cerrar panel',
      openLauncher: 'Abrir opciones de accesibilidad',
      reset: 'Restablecer todo',
      fontSize: 'Tamaño del texto',
      smaller: 'Reducir',
      larger: 'Aumentar',
      theme: 'Color y contraste',
      themeDefault: 'Predeterminado',
      themeHC: 'Alto contraste',
      themeInvert: 'Invertir',
      letterSpacing: 'Espacio entre letras',
      lsNormal: 'Normal',
      lsWide: 'Amplio',
      textAlign: 'Alineación del texto',
      taStart: 'Inicio',
      taCenter: 'Centro',
      taJustify: 'Justificado',
      saturation: 'Saturación',
      satDefault: 'Predeterminado',
      satLow: 'Baja saturación',
      satHigh: 'Alta saturación',
      satDesaturate: 'Desaturar',
      readingMask: 'Máscara de lectura',
      autoCC: 'Subtítulos CC',
      profilesTitle: 'Perfiles de accesibilidad',
      profileMotor: 'Discapacidad motora',
      profileBlindness: 'Ceguera',
      profileColorBlind: 'Daltonismo',
      profileDyslexia: 'Dislexia',
      profileLowVision: 'Visión baja',
      profileCognitive: 'Cognitivo y aprendizaje',
      profileEpilepsy: 'Convulsiones y epilépticos',
      profileAdhd: 'TDAH',
      reduceMotion: 'Reducir animaciones',
      cursorLarge: 'Cursor grande',
      readOnClick: 'Leer al hacer clic',
      readOnClickFeedbackOn: 'Lector de pantalla al hacer clic, habilitado.',
      readOnClickFeedbackOff: 'Lector de pantalla al hacer clic, deshabilitado.',
      readOnClickFeedbackNormal: 'Lectura al hacer clic, ritmo normal.',
      readOnClickFeedbackFast: 'Lectura al hacer clic, ritmo rápido.',
      readOnClickFeedbackSlow: 'Lectura al hacer clic, ritmo lento.',
      dyslexiaFriendly: 'Apto para dislexia',
      rsNormal: 'Normal',
      rsFast: 'Rápida',
      rsSlow: 'Lenta',
      rsOff: 'Apagado',
      ttsUnsupported: 'Tu navegador no soporta lectura por voz.',
      ccUnsupported: 'Tu navegador no soporta CC automático.',
      backdrop: 'Cerrar',
      on: 'Sí',
      off: 'No',
    },
    en: {
      title: 'Accessibility',
      close: 'Close panel',
      openLauncher: 'Open accessibility options',
      reset: 'Reset all',
      fontSize: 'Text size',
      smaller: 'Smaller',
      larger: 'Larger',
      theme: 'Color and contrast',
      themeDefault: 'Default',
      themeHC: 'High contrast',
      themeInvert: 'Invert',
      letterSpacing: 'Letter spacing',
      lsNormal: 'Normal',
      lsWide: 'Wide',
      textAlign: 'Text alignment',
      taStart: 'Left',
      taCenter: 'Center',
      taJustify: 'Justify',
      saturation: 'Saturation',
      satDefault: 'Default',
      satLow: 'Low saturation',
      satHigh: 'High saturation',
      satDesaturate: 'Desaturate',
      readingMask: 'Reading mask',
      autoCC: 'CC subtitles',
      profilesTitle: 'Accessibility profiles',
      profileMotor: 'Motor disability',
      profileBlindness: 'Blindness',
      profileColorBlind: 'Color blindness',
      profileDyslexia: 'Dyslexia',
      profileLowVision: 'Low vision',
      profileCognitive: 'Cognitive and learning',
      profileEpilepsy: 'Seizures and epilepsy',
      profileAdhd: 'ADHD',
      reduceMotion: 'Reduce motion',
      cursorLarge: 'Large cursor',
      readOnClick: 'Read on click',
      dyslexiaFriendly: 'Dyslexia friendly',
      rsNormal: 'Normal',
      rsFast: 'Fast',
      rsSlow: 'Slow',
      rsOff: 'Off',
      ttsUnsupported: 'Your browser does not support text-to-speech.',
      ccUnsupported: 'Your browser does not support automatic CC.',
      backdrop: 'Close',
      on: 'On',
      off: 'Off',
    },
  };

  var FONT_STEPS = ['100', '110', '120', '130'];
  var ALLOWED_THEMES = ['', 'high-contrast', 'invert'];
  var ALIGN_OPTIONS = ['', 'center', 'justify'];
  var LETTER_SPACING_OPTIONS = ['', 'wide'];
  var SATURATION_OPTIONS = ['', 'low', 'high', 'desaturate'];
  var READ_CLICK_MODES = ['off', 'normal', 'fast', 'slow'];
  var ACCESSIBILITY_PROFILES = [
    { key: 'motor', labelKey: 'profileMotor', settings: { reduceMotion: true } },
    { key: 'blindness', labelKey: 'profileBlindness', settings: { readOnClick: 'normal' } },
    { key: 'colorBlind', labelKey: 'profileColorBlind', settings: { saturation: 'high' } },
    { key: 'dyslexia', labelKey: 'profileDyslexia', settings: { reduceMotion: true, dyslexiaFriendly: true } },
    {
      key: 'lowVision',
      labelKey: 'profileLowVision',
      settings: { reduceMotion: true, fontStep: 1, cursorLarge: true, saturation: 'high' },
    },
    { key: 'cognitive', labelKey: 'profileCognitive', settings: { reduceMotion: true, fontStep: 1 } },
    { key: 'epilepsy', labelKey: 'profileEpilepsy', settings: { reduceMotion: true, saturation: 'low' } },
    { key: 'adhd', labelKey: 'profileAdhd', settings: { reduceMotion: true, readingMask: true, saturation: 'low' } },
  ];

  function getScriptBaseUrl() {
    var src = A11Y_WIDGET_SCRIPT_SRC;
    var script = null;
    if (!src) {
      script = document.currentScript;
      if (!script) {
        var scripts = document.getElementsByTagName('script');
        if (scripts.length) script = scripts[scripts.length - 1];
      }
      src = script && script.getAttribute('src');
    }
    if (!src) return '';
    try {
      var url = new URL(src, global.location.href);
      return url.href.replace(/[^/]*$/, '');
    } catch (e) {
      return src.replace(/[^/]*$/, '');
    }
  }

  function buildAssetUrl(baseUrl, relativePath) {
    if (!baseUrl) return relativePath;
    try {
      return new URL(relativePath, baseUrl).href;
    } catch (e) {
      return baseUrl.replace(/\/?$/, '/') + relativePath.replace(/^\/+/, '');
    }
  }

  function getGlobalCss(assetBaseUrl, assetMode) {
    // The original widget expected font files to be shipped alongside the script.
    // In Moodle deployments this may not be the case, and missing font files would trigger 404s.
    // Prefer local system Verdana when available and fall back to standard sans-serif in CSS.
    // If you later bundle fonts, you can extend this to include url(...) sources.
    return (
      '' +
      '@font-face{font-family:"VerdanaA11y";src:local("Verdana");font-weight:400;font-style:normal;font-display:swap;}' +
      '@font-face{font-family:"VerdanaA11y";src:local("Verdana Bold"),local("Verdana-Bold");font-weight:700;font-style:normal;font-display:swap;}' +
      '@font-face{font-family:"VerdanaA11y";src:local("Verdana Italic"),local("Verdana-Italic");font-weight:400;font-style:italic;font-display:swap;}' +
      '@font-face{font-family:"VerdanaA11y";src:local("Verdana Bold Italic"),local("Verdana-BoldItalic");font-weight:700;font-style:italic;font-display:swap;}'
    );
  }

  var GLOBAL_CSS =
    '' +
    'html[' +
    PREFIX +
    'font-scale="100"],html[' +
    PREFIX +
    'font-scale="100"] .modal{font-size:100%!important;}' +
    'html[' +
    PREFIX +
    'font-scale="110"],html[' +
    PREFIX +
    'font-scale="110"] .modal{font-size:110%!important;}' +
    'html[' +
    PREFIX +
    'font-scale="120"],html[' +
    PREFIX +
    'font-scale="120"] .modal{font-size:120%!important;}' +
    'html[' +
    PREFIX +
    'font-scale="130"],html[' +
    PREFIX +
    'font-scale="130"] .modal{font-size:130%!important;}' +
    'html[' +
    PREFIX +
    'theme="high-contrast"] body{background:#000!important;color:#fff!important;}' +
    'html[' +
    PREFIX +
    'theme="high-contrast"] body,html[' +
    PREFIX +
    'theme="high-contrast"] body *:not(img):not(video):not(svg):not(canvas):not(iframe){background:#000!important;color:#fff!important;border-color:#fff!important;box-shadow:none!important;text-shadow:none!important;background-image:none!important;}' +
    'html[' +
    PREFIX +
    'theme="high-contrast"] a{color:#ff0!important;text-decoration:underline!important;}' +
    'html[' +
    PREFIX +
    'theme="high-contrast"] button,html[' +
    PREFIX +
    'theme="high-contrast"] input,html[' +
    PREFIX +
    'theme="high-contrast"] textarea,html[' +
    PREFIX +
    'theme="high-contrast"] select{outline:2px solid #ff0!important;}' +
    'html[' +
    PREFIX +
    'theme="invert"]{filter:invert(1) hue-rotate(180deg);}' +
    'html[' +
    PREFIX +
    'theme="invert"] img,html[' +
    PREFIX +
    'theme="invert"] video,html[' +
    PREFIX +
    'theme="invert"] picture,html[' +
    PREFIX +
    'theme="invert"] svg:not([data-a11y-w-ignore]),html[' +
    PREFIX +
    'theme="invert"] canvas{filter:invert(1) hue-rotate(180deg);}' +
    'html[' +
    PREFIX +
    'letter-spacing="wide"] body{letter-spacing:.08em!important;}' +
    'html[' +
    PREFIX +
    'text-align="start"] body{text-align:start!important;}' +
    'html[' +
    PREFIX +
    'text-align="center"] body{text-align:center!important;}' +
    'html[' +
    PREFIX +
    'text-align="justify"] body{text-align:justify!important;}' +
    'html[' +
    PREFIX +
    'reduce-motion="on"] *,html[' +
    PREFIX +
    'reduce-motion="on"] *::before,html[' +
    PREFIX +
    'reduce-motion="on"] *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important;}' +
    'html[' +
    PREFIX +
    'read-on-click="on"] body{cursor:crosshair!important;}' +
    'html[' +
    PREFIX +
    'read-on-click="on"] [data-a11y-reading-active="1"]{outline:2px dashed var(--color-marca1)!important;outline-offset:3px!important;}' +
    'html[' +
    PREFIX +
    'saturation="low"] body img,html[' +
    PREFIX +
    'saturation="low"] body video,html[' +
    PREFIX +
    'saturation="low"] body picture{filter:saturate(0.6)!important;}' +
    'html[' +
    PREFIX +
    'saturation="high"] body img,html[' +
    PREFIX +
    'saturation="high"] body video,html[' +
    PREFIX +
    'saturation="high"] body picture{filter:saturate(1.6)!important;}' +
    'html[' +
    PREFIX +
    'saturation="desaturate"] body img,html[' +
    PREFIX +
    'saturation="desaturate"] body video,html[' +
    PREFIX +
    'saturation="desaturate"] body picture{filter:saturate(0)!important;}' +
    'html[' +
    PREFIX +
    'large-cursor="on"] body,html[' +
    PREFIX +
    'large-cursor="on"] body *:not(#a11y-widget-host):not(#a11y-widget-host *){cursor:url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http://www.w3.org/2000/svg%27%20width%3D%2732%27%20height%3D%2732%27%20viewBox%3D%270%200%2032%2032%27%3E%3Cpath%20d%3D%27M3%202L3%2024L9%2018L13%2030L18%2028L14%2017L23%2017Z%27%20fill%3D%27%23000%27%20stroke%3D%27%23fff%27%20stroke-width%3D%271.5%27/%3E%3C/svg%3E") 2 1,auto!important;}' +
    'html[' +
    PREFIX +
    'dyslexia-friendly="on"] body,html[' +
    PREFIX +
    'dyslexia-friendly="on"] body *:not(i):not(svg):not(path):not([class^="fa"]):not([class*=" fa"]):not(#a11y-widget-host):not(#a11y-widget-host *){font-family:"VerdanaA11y","Verdana","Arial",sans-serif!important;letter-spacing:.035em!important;word-spacing:.06em!important;font-kerning:auto!important;font-feature-settings:normal!important;}';

  function getConfig() {
    var c = global.a11yWidgetConfig || {};
    var userBase = typeof c.assetBaseUrl === 'string' && c.assetBaseUrl.trim() ? c.assetBaseUrl.trim() : '';
    var base = userBase || getScriptBaseUrl();
    var assetMode = userBase ? 'package' : 'scriptDir';
    return {
      lang: c.lang === 'en' ? 'en' : 'es',
      launcherContainer: typeof c.launcherContainer === 'string' ? c.launcherContainer : null,
      storageKey: typeof c.storageKey === 'string' ? c.storageKey : STORAGE_KEY,
      zIndex: typeof c.zIndex === 'number' ? c.zIndex : 2147483000,
      assetBaseUrl: base,
      assetMode: assetMode,
    };
  }

  function t(cfg, key) {
    var pack = I18N[cfg.lang] || I18N.es;
    return pack[key] || key;
  }

  function injectGlobalStyles(cfg, optDoc) {
    var doc = optDoc || document;
    if (!doc.head || doc.getElementById('a11y-widget-global-css')) return;
    var style = doc.createElement('style');
    style.id = 'a11y-widget-global-css';
    style.setAttribute('data-a11y-widget', 'inject');
    style.textContent = getGlobalCss(cfg.assetBaseUrl, cfg.assetMode) + GLOBAL_CSS;
    doc.head.appendChild(style);
  }

  function loadState(storageKey) {
    try {
      var raw = global.localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function saveState(storageKey, state) {
    try {
      global.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) {}
  }

  function defaultState() {
    return {
      fontStep: 0,
      theme: '',
      saturation: '',
      letterSpacing: '',
      textAlign: '',
      readingMask: false,
      autoCC: false,
      reduceMotion: false,
      cursorLarge: false,
      readOnClick: 'off',
      dyslexiaFriendly: false,
      activeProfile: '',
      profilesCollapsed: false,
    };
  }

  function applyFontScaleFallback(scalePercent, optDoc) {
    var doc = optDoc || document;
    if (!doc.body) return;

    var scale = Number(scalePercent) / 100;
    var nodes = doc.body.querySelectorAll('*');
    var i;

    if (scale === 1) {
      for (i = 0; i < nodes.length; i += 1) {
        var resetEl = nodes[i];
        if (resetEl.closest('#a11y-widget-host')) continue;
        if (resetEl.hasAttribute('data-a11y-base-font-size')) {
          resetEl.style.removeProperty('font-size');
          resetEl.removeAttribute('data-a11y-base-font-size');
        }
      }
      return;
    }

    // Paso 1: capturamos tamaño base antes de aplicar cambios, para evitar acumulación.
    for (i = 0; i < nodes.length; i += 1) {
      var captureEl = nodes[i];
      if (captureEl.closest('#a11y-widget-host')) continue;
      if (captureEl.hasAttribute('data-a11y-base-font-size')) continue;
      var computed = global.getComputedStyle(captureEl).fontSize || '';
      if (computed.indexOf('px') === -1) continue;
      var base = parseFloat(computed);
      if (!base || base <= 0) continue;
      captureEl.setAttribute('data-a11y-base-font-size', String(base));
    }

    // Paso 2: aplicamos tamaño escalado tomando siempre el valor base.
    for (i = 0; i < nodes.length; i += 1) {
      var applyEl = nodes[i];
      if (applyEl.closest('#a11y-widget-host')) continue;
      var original = parseFloat(applyEl.getAttribute('data-a11y-base-font-size'));
      if (!original || original <= 0) continue;
      applyEl.style.setProperty('font-size', (original * scale).toFixed(2) + 'px', 'important');
    }
  }

  function applyToDocument(htmlEl, state, optDoc) {
    var doc = optDoc || document;
    var fs = FONT_STEPS[state.fontStep] || FONT_STEPS[0];
    htmlEl.setAttribute(PREFIX + 'font-scale', fs);
    applyFontScaleFallback(fs, doc);

    if (ALLOWED_THEMES.indexOf(state.theme) === -1) state.theme = '';
    if (state.theme) htmlEl.setAttribute(PREFIX + 'theme', state.theme);
    else htmlEl.removeAttribute(PREFIX + 'theme');

    if (SATURATION_OPTIONS.indexOf(state.saturation) === -1) state.saturation = '';
    if (state.saturation) htmlEl.setAttribute(PREFIX + 'saturation', state.saturation);
    else htmlEl.removeAttribute(PREFIX + 'saturation');

    if (state.letterSpacing) htmlEl.setAttribute(PREFIX + 'letter-spacing', state.letterSpacing);
    else htmlEl.removeAttribute(PREFIX + 'letter-spacing');

    if (state.textAlign) htmlEl.setAttribute(PREFIX + 'text-align', state.textAlign);
    else htmlEl.removeAttribute(PREFIX + 'text-align');

    htmlEl.setAttribute(PREFIX + 'reading-mask', state.readingMask ? 'on' : 'off');
    htmlEl.setAttribute(PREFIX + 'auto-cc', state.autoCC ? 'on' : 'off');
    htmlEl.setAttribute(PREFIX + 'reduce-motion', state.reduceMotion ? 'on' : 'off');
    htmlEl.setAttribute(PREFIX + 'large-cursor', state.cursorLarge ? 'on' : 'off');
    htmlEl.setAttribute(PREFIX + 'read-on-click', state.readOnClick === 'off' ? 'off' : 'on');
    htmlEl.setAttribute(PREFIX + 'dyslexia-friendly', state.dyslexiaFriendly ? 'on' : 'off');
  }

  function shadowCss(cfg) {
    var z = cfg.zIndex;
    return (
      ':host{all:initial;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}' +
      '*{box-sizing:border-box;}' +
      '.w{--w-bg:#f6f7f9;--w-fg:#111;--w-bd:#c8ccd4;--w-accent:var(--color-marca1);--w-accent-soft:color-mix(in srgb, var(--color-marca1) 12%, transparent);--w-surface:#ffffff;--w-radius:12px;--w-shadow:0 8px 32px rgba(0,0,0,.18);font-size:16px;line-height:1.4;color:var(--w-fg);}' +
      '.fab{border:0;border-radius:50%;width:52px;height:52px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:var(--highlight);color:#fff;box-shadow:var(--w-shadow);transition:transform .16s ease,filter .16s ease;}' +
      '.fab:hover{transform:translateY(-1px);filter:brightness(1.05);}' +
      '.fab:focus-visible{outline:3px solid #000;outline-offset:3px;}' +
      '.fab svg,.fab img{width:50px;height:50px;}' +
      '.backdrop{position:fixed;inset:0;background:transparent;z-index:' +
      (z - 1) +
      ';border:0;padding:0;cursor:default;pointer-events:none;}' +
      '.panel{position:fixed;top:0;right:0;height:100%;width:min(100vw,400px);max-width:100vw;background:var(--w-bg);z-index:' +
      z +
      ';box-shadow:-4px 0 24px rgba(0,0,0,.15);display:flex;flex-direction:column;transform:translateX(100%);transition:transform .22s ease;}' +
      '.panel[data-open="1"]{transform:translateX(0);}' +
      '@media (max-width:480px){.panel{width:100%;}}' +
      '.hdr{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;border-bottom:1px solid var(--w-bd);background:#fff;}' +
      '.hdr h2{margin:0;font-size:1.1rem;font-weight:700;}' +
      '.close{border:0;background:transparent;cursor:pointer;padding:8px;border-radius:8px;color:inherit;transition:background .16s ease,color .16s ease;}' +
      '.close:hover{background:var(--w-accent-soft);color:var(--w-accent);}' +
      '.close:focus-visible{outline:2px solid var(--w-accent);}' +
      '.body{flex:1;overflow:auto;padding:14px;}' +
      '.profiles-wrap{margin-bottom:12px;}' +
      '.profiles-toggle{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;border:0;background:transparent;padding:0 0 8px 0;cursor:pointer;color:inherit;transition:color .16s ease;}' +
      '.profiles-toggle:hover{color:var(--w-accent);}' +
      '.profiles-toggle:focus-visible{outline:2px solid var(--w-accent);outline-offset:2px;border-radius:6px;}' +
      '.profiles-title{font-size:.88rem;font-weight:700;margin:0;}' +
      '.profiles-chevron{display:inline-flex;transition:transform .18s ease;}' +
      '.profiles-wrap[data-collapsed="1"] .profiles-chevron{transform:rotate(-90deg);}' +
      '.profiles-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;}' +
      '.profiles-wrap[data-collapsed="1"] .profiles-grid{display:none;}' +
      '.profile-btn{border:1px solid var(--w-bd);background:#fff;padding:10px;border-radius:12px;cursor:pointer;font:inherit;display:flex;align-items:center;gap:8px;text-align:left;min-height:56px;transition:border-color .16s ease,background .16s ease,transform .16s ease,box-shadow .16s ease;}' +
      '.profile-btn:hover{border-color:var(--w-accent);transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,.08);}' +
      '.profile-btn[data-on="1"]{border-color:var(--w-accent);background:var(--highlight);color:#fff;}' +
      '.profile-btn:focus-visible{outline:2px solid var(--w-accent);}' +
      '.profile-ico{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:999px;background:#ededed;flex:0 0 26px;color:#222;}' +
      '.profile-ico svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;}' +
      '.profile-label{font-size:.83rem;font-weight:600;line-height:1.15;}' +
      '.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;}' +
      '@media (max-width:640px){.grid{grid-template-columns:repeat(2,minmax(0,1fr));}}' +
      '.opt{border:1px solid var(--w-bd);background:#fff;padding:10px;border-radius:12px;cursor:pointer;font:inherit;display:flex;flex-direction:column;gap:6px;min-height:108px;align-items:flex-start;justify-content:flex-start;text-align:left;transition:border-color .16s ease,background .16s ease,transform .16s ease,box-shadow .16s ease;}' +
      '.opt:hover{border-color:var(--w-accent);transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,.08);}' +
      '.opt[data-on="1"]{border-color:var(--w-accent);background:var(--highlight);color:#fff;}' +
      '.opt:focus-visible{outline:2px solid var(--w-accent);}' +
      '.opt-icon{display:inline-flex;align-items:center;justify-content:center;min-width:36px;height:28px;padding:2px 6px;border-radius:999px;background:#f2f2f2;color:#1f1f1f;font-size:.76rem;font-weight:700;line-height:1;}' +
      '.opt-icon svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;}' +
      '.opt[data-on="1"] .opt-icon{background:#437a00;color:#fff;}' +
      '.opt-title{font-size:.88rem;font-weight:700;line-height:1.2;}' +
      '.opt-value{font-size:.79rem;line-height:1.2;color:#444;font-weight:600;}' +
      '.opt[data-on="1"] .opt-value{color:#fff;}' +
      '.reset{margin-top:12px;width:100%;border:1px solid var(--highlight);background:var(--highlight);padding:10px;border-radius:10px;cursor:pointer;font:inherit;color:#fff;transition:border-color .16s ease,background .16s ease,color .16s ease;}' +
      '.reset:hover{border-color:var(--highlight);background:transparent;color:var(--highlight);}' +
      '.reset:focus-visible{outline:2px solid var(--w-accent);}' +
      '.toolbar-host{display:inline-flex;vertical-align:middle;}'
    );
  }

  function iconPerson() {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="50" height="50" aria-hidden="true" focusable="false" data-a11y-w-ignore>' +
      '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
      '<g transform="translate(-30 -30)">' +
      '<g transform="translate(30 30)">' +
      '<circle cx="30" cy="30" r="30"/>' +
      '<path fill="#FFFFFF" fill-rule="nonzero" d="M30,4.42857143 C44.12271,4.42857143 55.5714286,15.87729 55.5714286,30 C55.5714286,44.12271 44.12271,55.5714286 30,55.5714286 C15.87729,55.5714286 4.42857143,44.12271 4.42857143,30 C4.42857143,15.87729 15.87729,4.42857143 30,4.42857143 Z M30,6.42857143 C16.9818595,6.42857143 6.42857143,16.9818595 6.42857143,30 C6.42857143,43.0181405 16.9818595,53.5714286 30,53.5714286 C43.0181405,53.5714286 53.5714286,43.0181405 53.5714286,30 C53.5714286,16.9818595 43.0181405,6.42857143 30,6.42857143 Z M40.5936329,24.636146 C40.8208154,24.6942382 41.032297,24.8027599 41.212927,24.9537151 C41.3927444,25.1040671 41.5372605,25.2927156 41.6362456,25.506032 C41.7348561,25.7185411 41.7857143,25.9504498 41.7857143,26.1964545 C41.7780029,26.5779794 41.6395197,26.9452414 41.3935596,27.2352841 C41.1463511,27.5267988 40.8059352,27.7221149 40.4376358,27.7856619 C38.1921773,28.2017648 35.924387,28.4827808 33.6481064,28.6271294 C33.504948,28.636723 33.3651112,28.6758744 33.236922,28.7423749 C33.1082304,28.8090766 32.9940039,28.9018917 32.9011681,29.0153772 C32.8079332,29.1293505 32.7382931,29.2617886 32.6966918,29.404413 C32.6758615,29.4759144 32.6622539,29.5492793 32.6556797,29.6151616 L32.6510699,29.707205 L32.6598659,29.8496307 L32.8523035,31.5976067 C33.0926408,33.748446 33.5345387,35.8701755 34.1700609,37.9296172 L34.4174424,38.6989233 L34.6845982,39.467246 L35.9271291,42.8464114 C35.9992453,43.0440742 36.0318055,43.2541674 36.0229684,43.4645736 C36.0141278,43.6750654 35.9640303,43.8817121 35.8754594,44.0726551 C35.7867069,44.2638976 35.6611068,44.435479 35.5058759,44.5773262 C35.3501721,44.7195962 35.1677426,44.8289881 34.990022,44.8912207 C34.813373,44.9615763 34.6253467,44.9984764 34.4204191,45 C34.1147901,44.9943164 33.8175473,44.8987335 33.5650597,44.7252745 C33.4238771,44.6283171 33.2997507,44.5091367 33.1890431,44.3580526 L33.0826737,44.1959755 L33.0074053,44.0456077 L32.6901551,43.3562659 C31.8320879,41.4806152 31.0484874,39.6428286 30.3335907,37.8221303 L30.0024971,36.9627165 L29.5751047,38.0696169 C29.3403684,38.6636654 29.0998399,39.2560704 28.8536693,39.8464776 L28.4802005,40.730546 L27.9043756,42.0504488 L27.3109116,43.3600706 L27.0273167,43.9425803 C26.8810403,44.3389204 26.5849764,44.6608321 26.2034873,44.8369557 C25.8203243,45.0138521 25.3831542,45.0287926 24.9891662,44.8783588 C24.596572,44.7285499 24.2795594,44.4271943 24.1072539,44.0414047 C23.9885793,43.7756939 23.9446874,43.4836867 23.9834048,43.1768668 L24.016611,42.9910892 L24.0667666,42.8262042 L25.307875,39.4507095 C26.0439275,37.4198431 26.5851782,35.3222044 26.9239335,33.1916604 L27.0414597,32.3912301 L27.141282,31.5772235 L27.3403361,29.8381618 C27.3581635,29.6889408 27.3459492,29.5375642 27.3045081,29.3935084 C27.2630999,29.2497044 27.1934915,29.1162414 27.1000261,29.0011883 C27.0070148,28.8866944 26.8923305,28.7928596 26.7631114,28.7253145 C26.6343439,28.6580256 26.4937323,28.6181655 26.35351,28.6082966 C24.0561093,28.4626746 21.7692364,28.17737 19.5069975,27.7542651 C19.3015835,27.7165557 19.1057712,27.6379419 18.9308258,27.5230481 C18.7563857,27.408486 18.6063103,27.2602422 18.4889941,27.0867756 C18.3721069,26.9139017 18.2901967,26.7194847 18.2478998,26.5149205 C18.2055002,26.3103882 18.2034637,26.0993152 18.2403615,25.9020167 C18.2758029,25.695193 18.3515339,25.4974971 18.4633288,25.3201771 C18.5754166,25.1425366 18.7215515,24.9891682 18.8933065,24.8690391 C19.0655425,24.7486376 19.2599761,24.6643395 19.4651939,24.6211361 C19.6706526,24.577882 19.8826185,24.5767675 20.0822706,24.6166765 C26.6343689,25.8477827 33.3528511,25.8477827 39.8979716,24.6180222 C40.1283133,24.5717053 40.3659882,24.5779122 40.5936329,24.636146 Z M32.8056386,16.182956 C34.3520224,17.7551666 34.3520224,20.3006423 32.80563,21.8728616 C31.2542658,23.450066 28.7353061,23.450066 27.1840106,21.8728616 C25.6375563,20.3006489 25.6375563,17.7551599 27.1839933,16.1829647 C28.7352993,14.6056799 31.2542726,14.6056799 32.8056386,16.182956 Z"/>' +
      '</g></g></g></svg>'
    );
  }

  function nextInCycle(list, current) {
    var idx = list.indexOf(current);
    var next = idx + 1;
    if (idx === -1 || next >= list.length) return list[0];
    return list[next];
  }

  function cycleFieldValue(field, state) {
    if (field === 'fontStep') {
      state.fontStep = (state.fontStep + 1) % FONT_STEPS.length;
      return;
    }
    if (field === 'theme') {
      state.theme = nextInCycle(ALLOWED_THEMES, state.theme);
      return;
    }
    if (field === 'saturation') {
      state.saturation = nextInCycle(SATURATION_OPTIONS, state.saturation);
      return;
    }
    if (field === 'letterSpacing') {
      state.letterSpacing = nextInCycle(LETTER_SPACING_OPTIONS, state.letterSpacing);
      return;
    }
    if (field === 'textAlign') {
      state.textAlign = nextInCycle(ALIGN_OPTIONS, state.textAlign);
      return;
    }
    if (field === 'readingMask') {
      state.readingMask = !state.readingMask;
      return;
    }
    if (field === 'autoCC') {
      state.autoCC = !state.autoCC;
      return;
    }
    if (field === 'reduceMotion') {
      state.reduceMotion = !state.reduceMotion;
      return;
    }
    if (field === 'cursorLarge') {
      state.cursorLarge = !state.cursorLarge;
      return;
    }
    if (field === 'dyslexiaFriendly') {
      state.dyslexiaFriendly = !state.dyslexiaFriendly;
      return;
    }
    if (field === 'readOnClick') {
      state.readOnClick = nextInCycle(READ_CLICK_MODES, state.readOnClick);
    }
  }

  function getFieldLabel(cfg, field) {
    if (field === 'fontStep') return t(cfg, 'fontSize');
    if (field === 'theme') return t(cfg, 'theme');
    if (field === 'saturation') return t(cfg, 'saturation');
    if (field === 'letterSpacing') return t(cfg, 'letterSpacing');
    if (field === 'textAlign') return t(cfg, 'textAlign');
    if (field === 'readingMask') return t(cfg, 'readingMask');
    if (field === 'autoCC') return t(cfg, 'autoCC');
    if (field === 'reduceMotion') return t(cfg, 'reduceMotion');
    if (field === 'cursorLarge') return t(cfg, 'cursorLarge');
    if (field === 'dyslexiaFriendly') return t(cfg, 'dyslexiaFriendly');
    if (field === 'readOnClick') return t(cfg, 'readOnClick');
    return field;
  }

  function getFieldValueLabel(cfg, field, state) {
    if (field === 'fontStep') return 'x' + String(state.fontStep + 1);
    if (field === 'theme') {
      if (state.theme === 'high-contrast') return t(cfg, 'themeHC');
      if (state.theme === 'invert') return t(cfg, 'themeInvert');
      return t(cfg, 'themeDefault');
    }
    if (field === 'saturation') {
      if (state.saturation === 'low') return t(cfg, 'satLow');
      if (state.saturation === 'high') return t(cfg, 'satHigh');
      if (state.saturation === 'desaturate') return t(cfg, 'satDesaturate');
      return t(cfg, 'satDefault');
    }
    if (field === 'letterSpacing') {
      return state.letterSpacing === 'wide' ? t(cfg, 'lsWide') : t(cfg, 'lsNormal');
    }
    if (field === 'textAlign') {
      if (state.textAlign === 'center') return t(cfg, 'taCenter');
      if (state.textAlign === 'justify') return t(cfg, 'taJustify');
      return t(cfg, 'taStart');
    }
    if (field === 'readingMask') return state.readingMask ? t(cfg, 'on') : t(cfg, 'off');
    if (field === 'autoCC') return state.autoCC ? t(cfg, 'on') : t(cfg, 'off');
    if (field === 'reduceMotion') return state.reduceMotion ? t(cfg, 'on') : t(cfg, 'off');
    if (field === 'cursorLarge') return state.cursorLarge ? t(cfg, 'on') : t(cfg, 'off');
    if (field === 'dyslexiaFriendly') return state.dyslexiaFriendly ? t(cfg, 'on') : t(cfg, 'off');
    if (field === 'readOnClick') {
      if (state.readOnClick === 'fast') return t(cfg, 'rsFast');
      if (state.readOnClick === 'slow') return t(cfg, 'rsSlow');
      if (state.readOnClick === 'normal') return t(cfg, 'rsNormal');
      return t(cfg, 'rsOff');
    }
    return '';
  }

  function getFieldIconSvg(field, state) {
    if (field === 'fontStep') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19l4-12 4 12"/><path d="M5.4 15h5.2"/><path d="M14 7h6"/><path d="M17 7v12"/></svg>';
    }
    if (field === 'theme') {
      if (state.theme === 'high-contrast') {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" style="fill:currentColor;stroke:none;"/></svg>';
      }
      if (state.theme === 'invert') {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7H4v4"/><path d="M4 11a8 8 0 0 0 14 2"/><path d="M16 17h4v-4"/><path d="M20 13A8 8 0 0 0 6 11"/></svg>';
      }
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/><path d="M4.9 4.9l2.1 2.1"/><path d="M17 17l2.1 2.1"/><path d="M19.1 4.9L17 7"/><path d="M7 17l-2.1 2.1"/></svg>';
    }
    if (field === 'saturation') {
      if (state.saturation === 'low') {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C9 7 7 9.8 7 13a5 5 0 0 0 10 0c0-3.2-2-6-5-10z"/><path d="M8 13a4 4 0 0 0 8 0" opacity=".5"/></svg>';
      }
      if (state.saturation === 'high') {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C9 7 7 9.8 7 13a5 5 0 0 0 10 0c0-3.2-2-6-5-10z"/><path d="M12 6v5"/><path d="M9.5 8.5l5 5"/></svg>';
      }
      if (state.saturation === 'desaturate') {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C9 7 7 9.8 7 13a5 5 0 0 0 10 0c0-3.2-2-6-5-10z"/><path d="M6 18l12-12"/></svg>';
      }
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C9 7 7 9.8 7 13a5 5 0 0 0 10 0c0-3.2-2-6-5-10z"/></svg>';
    }
    if (field === 'letterSpacing') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17l3-10 3 10"/><path d="M6 14h4"/><path d="M14 12h6"/><path d="M14 9l-2 3 2 3"/><path d="M20 9l2 3-2 3"/></svg>';
    }
    if (field === 'textAlign') {
      if (state.textAlign === 'center') {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14"/><path d="M7 11h10"/><path d="M5 15h14"/><path d="M7 19h10"/></svg>';
      }
      if (state.textAlign === 'justify') {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"/><path d="M4 11h16"/><path d="M4 15h16"/><path d="M4 19h16"/></svg>';
      }
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h14"/><path d="M4 11h10"/><path d="M4 15h14"/><path d="M4 19h10"/></svg>';
    }
    if (field === 'readingMask') {
      if (state.readingMask) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="5"/><rect x="4" y="15" width="16" height="5"/><path d="M4 12h16"/></svg>';
      }
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="5"/><rect x="4" y="15" width="16" height="5"/></svg>';
    }
    if (field === 'autoCC') {
      if (state.autoCC) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 12h2"/><path d="M14 12h2"/><path d="M7 10v4"/><path d="M17 10v4"/></svg>';
      }
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 12h2"/><path d="M14 12h2"/></svg>';
    }
    if (field === 'reduceMotion') {
      if (state.reduceMotion) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M9 9l6 6"/><path d="M15 9l-6 6"/></svg>';
      }
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7l8 5-8 5z" style="fill:currentColor;stroke:none;"/><path d="M4 12h2"/><path d="M18 12h2"/></svg>';
    }
    if (field === 'cursorLarge') {
      if (state.cursorLarge) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3v15l4-4 3 8 3-1-3-8h7z"/></svg>';
      }
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4v12l3-3 2 6 2-1-2-6h5z"/></svg>';
    }
    if (field === 'dyslexiaFriendly') {
      if (state.dyslexiaFriendly) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h9"/><path d="M5 10h7"/><path d="M5 14h8"/><path d="M5 18h10"/><circle cx="18" cy="9" r="2"/><path d="M16 16h4"/></svg>';
      }
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h9"/><path d="M5 10h7"/><path d="M5 14h8"/><path d="M5 18h10"/></svg>';
    }
    if (field === 'readOnClick') {
      if (state.readOnClick === 'fast') {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h8"/><path d="M3 16h6"/><path d="M3 8h6"/><path d="M14 8l7 4-7 4z" style="fill:currentColor;stroke:none;"/></svg>';
      }
      if (state.readOnClick === 'slow') {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h6"/><path d="M3 16h4"/><path d="M3 8h4"/><path d="M13 7v10"/><path d="M17 7v10"/></svg>';
      }
      if (state.readOnClick === 'normal') {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4"/><path d="M7 8v8"/><path d="M10 6v12"/><path d="M14 9l6 3-6 3z" style="fill:currentColor;stroke:none;"/></svg>';
      }
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h7"/><path d="M3 16h5"/><path d="M3 8h5"/><path d="M13 8l7 4-7 4z"/><path d="M7 7l10 10"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg>';
  }

  function isFieldActive(field, state) {
    if (field === 'fontStep') return state.fontStep > 0;
    if (field === 'theme') return !!state.theme;
    if (field === 'saturation') return !!state.saturation;
    if (field === 'letterSpacing') return !!state.letterSpacing;
    if (field === 'textAlign') return !!state.textAlign;
    if (field === 'readingMask') return !!state.readingMask;
    if (field === 'autoCC') return !!state.autoCC;
    if (field === 'reduceMotion') return !!state.reduceMotion;
    if (field === 'cursorLarge') return !!state.cursorLarge;
    if (field === 'dyslexiaFriendly') return !!state.dyslexiaFriendly;
    if (field === 'readOnClick') return state.readOnClick !== 'off';
    return false;
  }

  function optionCardHTML(cfg, state, field) {
    return (
      '<button type="button" class="opt" data-cycle="' +
      field +
      '" data-on="' +
      (isFieldActive(field, state) ? '1' : '0') +
      '">' +
      '<span class="opt-icon" data-icon="' +
      field +
      '">' +
      getFieldIconSvg(field, state) +
      '</span>' +
      '<span class="opt-title">' +
      esc(getFieldLabel(cfg, field)) +
      '</span>' +
      '<span class="opt-value" data-value="' +
      field +
      '">' +
      esc(getFieldValueLabel(cfg, field, state)) +
      '</span>' +
      '</button>'
    );
  }

  function getProfileByKey(profileKey) {
    for (var i = 0; i < ACCESSIBILITY_PROFILES.length; i += 1) {
      if (ACCESSIBILITY_PROFILES[i].key === profileKey) return ACCESSIBILITY_PROFILES[i];
    }
    return null;
  }

  function applyProfileToState(state, profileKey) {
    var profile = getProfileByKey(profileKey);
    if (!profile) return;
    var base = defaultState();
    var key;
    for (key in base) {
      if (Object.prototype.hasOwnProperty.call(base, key)) state[key] = base[key];
    }
    for (key in profile.settings) {
      if (Object.prototype.hasOwnProperty.call(profile.settings, key)) {
        state[key] = profile.settings[key];
      }
    }
    state.activeProfile = profileKey;
  }

  function getProfileIconSvg(profileKey) {
    if (profileKey === 'motor') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2.5"/><path d="M12 8v6"/><path d="M9 12h6"/><path d="M12 14l-3 5"/><path d="M12 14l3 5"/></svg>';
    }
    if (profileKey === 'blindness') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.5"/></svg>';
    }
    if (profileKey === 'colorBlind') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="10" r="4"/><circle cx="15" cy="10" r="4"/><path d="M6 16c1.2 1 2.6 2 6 2s4.8-1 6-2"/></svg>';
    }
    if (profileKey === 'dyslexia') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h8"/><path d="M5 10h6"/><path d="M5 14h7"/><path d="M5 18h9"/><circle cx="18" cy="9" r="2"/></svg>';
    }
    if (profileKey === 'lowVision') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="5"/><path d="M14 14l6 6"/><path d="M8 10h4"/><path d="M10 8v4"/></svg>';
    }
    if (profileKey === 'cognitive') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5a3 3 0 0 0-3 3c0 1.1.6 2.1 1.4 2.6A3.5 3.5 0 0 0 6 17"/><path d="M16 5a3 3 0 0 1 3 3c0 1.1-.6 2.1-1.4 2.6.8.6 1.4 1.7 1.4 2.8"/><path d="M8 7h8"/><path d="M8 12h8"/><path d="M9 17h6"/></svg>';
    }
    if (profileKey === 'epilepsy') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L5 13h6l-1 9 8-11h-6z"/></svg>';
    }
    if (profileKey === 'adhd') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2"/><path d="M20 12h-2"/><path d="M12 20v-2"/><path d="M4 12h2"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg>';
  }

  function profileCardHTML(cfg, state, profile) {
    return (
      '<button type="button" class="profile-btn" data-profile="' +
      profile.key +
      '" data-on="' +
      (state.activeProfile === profile.key ? '1' : '0') +
      '">' +
      '<span class="profile-ico">' +
      getProfileIconSvg(profile.key) +
      '</span>' +
      '<span class="profile-label">' +
      esc(t(cfg, profile.labelKey)) +
      '</span>' +
      '</button>'
    );
  }

  function buildPanelHTML(cfg, state) {
    var T = function (k) {
      return t(cfg, k);
    };
    var profileCards = '';
    for (var i = 0; i < ACCESSIBILITY_PROFILES.length; i += 1) {
      profileCards += profileCardHTML(cfg, state, ACCESSIBILITY_PROFILES[i]);
    }
    return (
      '<div class="w">' +
      '<button type="button" class="fab" data-act="toggle-panel" aria-expanded="false" aria-controls="a11y-w-panel" title="' +
      esc(T('openLauncher')) +
      '">' +
      iconPerson() +
      '</button>' +

      '<aside id="a11y-w-panel" class="panel" role="dialog" aria-modal="true" aria-labelledby="a11y-w-title" data-open="0" hidden>' +
      '<div class="hdr">' +
      '<h2 id="a11y-w-title">' +
      esc(T('title')) +
      '</h2>' +
      '<button type="button" class="close" data-act="close" aria-label="' +
      esc(T('close')) +
      '">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>' +
      '</button>' +
      '</div>' +
      '<div class="body">' +
      '<div class="profiles-wrap" data-collapsed="' +
      (state.profilesCollapsed ? '1' : '0') +
      '">' +
      '<button type="button" class="profiles-toggle" data-act="toggle-profiles" aria-expanded="' +
      (state.profilesCollapsed ? 'false' : 'true') +
      '">' +
      '<span class="profiles-title">' +
      esc(T('profilesTitle')) +
      '</span><span class="profiles-chevron" aria-hidden="true">' +
      '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>' +
      '</span></button>' +
      '<div class="profiles-grid">' +
      profileCards +
      '</div>' +
      '</div>' +
      '<div class="grid">' +
      optionCardHTML(cfg, state, 'theme') +
      optionCardHTML(cfg, state, 'saturation') +
      optionCardHTML(cfg, state, 'readingMask') +
      optionCardHTML(cfg, state, 'autoCC') +
      optionCardHTML(cfg, state, 'reduceMotion') +
      optionCardHTML(cfg, state, 'cursorLarge') +
      optionCardHTML(cfg, state, 'dyslexiaFriendly') +
      optionCardHTML(cfg, state, 'readOnClick') +
      optionCardHTML(cfg, state, 'fontStep') +
      optionCardHTML(cfg, state, 'letterSpacing') +
      optionCardHTML(cfg, state, 'textAlign') +
      '</div>' +
      '<button type="button" class="reset" data-act="reset">' +
      esc(T('reset')) +
      '</button>' +
      '</div></aside></div>'
    );
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function isInIframe() {
    try {
      return global.self !== global.top;
    } catch (e) {
      // If we cannot access top (e.g. cross-origin), treat as iframe to avoid duplicates/clipping.
      return true;
    }
  }

  function init() {
    // Prevent mounting inside iframes/modals that render course cards or activities.
    // The top-level page already has the widget, and mounting inside embedded frames causes duplicates
    // and clipped UI due to iframe viewport constraints.
    if (isInIframe()) {
      return;
    }

    // Prevent duplicate mounts in the same document (e.g. AJAX fragment reloads, double script injection).
    // If a host already exists, do not create another instance.
    if (global.__a11yWidgetMounted || document.getElementById('a11y-widget-host')) {
      global.__a11yWidgetMounted = true;
      return;
    }
    global.__a11yWidgetMounted = true;

    var cfg = getConfig();
    injectGlobalStyles(cfg);
    var htmlEl = document.documentElement;
    var saved = loadState(cfg.storageKey);
    var state = defaultState();
    if (saved && typeof saved === 'object') {
      for (var k in state) {
        if (Object.prototype.hasOwnProperty.call(saved, k)) state[k] = saved[k];
      }
    }
    if (state.fontStep < 0) state.fontStep = 0;
    if (state.fontStep > FONT_STEPS.length - 1) state.fontStep = FONT_STEPS.length - 1;
    state.profilesCollapsed = false;

    // Normalize persisted values that may come from older versions.
    if (state.readOnClick === true) state.readOnClick = 'normal';
    if (state.readOnClick === false) state.readOnClick = 'off';

    // If TTS is not supported, don't keep the UI in "read on click" mode.
    var ttsSupported = !!(global.speechSynthesis && global.SpeechSynthesisUtterance);
    if (state.readOnClick !== 'off' && !ttsSupported) {
      state.readOnClick = 'off';
    }

    applyToDocument(htmlEl, state);

    var host = document.createElement('div');
    host.id = 'a11y-widget-host';
    host.setAttribute('data-a11y-widget', 'root');

    var container = cfg.launcherContainer ? document.querySelector(cfg.launcherContainer) : null;
    if (container) {
      host.className = 'toolbar-host';
      host.style.zIndex = String(cfg.zIndex);
      container.appendChild(host);
    } else {
      host.style.cssText = 'position:fixed;inset:auto 16px 16px auto;z-index:' + cfg.zIndex + ';';
      document.body.appendChild(host);

      // Some UI states (e.g. modals) add padding to <body>. If <body> becomes a containing block for fixed
      // positioned elements (via transforms), that padding can visually shift the launcher away from the
      // viewport corner. We compensate by subtracting body paddings from the inset values.
      function updateFloatingInsets() {
        if (container) return;
        var base = 16;
        var pr = 0;
        var pb = 0;
        try {
          if (document.body) {
            var bs = global.getComputedStyle(document.body);
            pr = parseFloat(bs.paddingRight) || 0;
            pb = parseFloat(bs.paddingBottom) || 0;
          }
        } catch (ePad) {}
        if (!isFinite(pr) || pr < 0) pr = 0;
        if (!isFinite(pb) || pb < 0) pb = 0;
        pr = Math.min(pr, 240);
        pb = Math.min(pb, 240);
        host.style.inset = 'auto ' + (base - pr) + 'px ' + (base - pb) + 'px auto';
      }

      updateFloatingInsets();
      global.addEventListener('resize', updateFloatingInsets);
      try {
        var bodyMo = new MutationObserver(updateFloatingInsets);
        bodyMo.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
      } catch (eBodyMo) {}
    }

    var root = host.attachShadow({ mode: 'open' });
    var styleEl = document.createElement('style');
    styleEl.textContent = shadowCss(cfg);
    root.appendChild(styleEl);

    var wrap = document.createElement('div');
    wrap.innerHTML = buildPanelHTML(cfg, state);
    root.appendChild(wrap.firstElementChild);

    var fab = root.querySelector('.fab');
    var panel = root.querySelector('.panel');
    var synth = global.speechSynthesis || null;
    var speechSupported = !!(synth && global.SpeechSynthesisUtterance);
    var SpeechRecognitionCtor = global.SpeechRecognition || global.webkitSpeechRecognition || null;
    var activeReadableEl = null;
    var readClickPointerStart = null;
    var lastReadOnClickState = state.readOnClick !== 'off';
    var ccOverlay = null;
    var ccTextNode = null;
    var ccRecognizer = null;
    var ccCurrentMedia = null;
    var ccCurrentMode = '';
    var ccMediaListenerBound = false;
    var ccMediaObserver = null;
    var ccMediaBound = [];
    var ccVttCache = {};
    var ccVttMedia = null;
    var ccVttTickHandler = null;
    var ccSessionToken = 0;
    var readingMaskOverlay = null;
    var readingMaskTop = null;
    var readingMaskBottom = null;
    var readingMaskBand = null;
    var readingMaskLineTop = null;
    var readingMaskLineBottom = null;
    // didacticagilesson backdrop uses z-index 9999; mask must sit above it but below the widget UI.
    var AGILESSON_BACKDROP_Z = 9999;
    var readingMaskIframeMoveHandler = null;
    var readingMaskIframeMoveTarget = null;
    var readingMaskDomSyncTimer = null;
    var agilessonBackdropWasOpen = false;

    function getReadingMaskZIndex() {
      var widgetZ = cfg.zIndex || 2147483000;
      var minZ = AGILESSON_BACKDROP_Z + 1;
      var maxZ = widgetZ - 10;
      if (maxZ < minZ) {
        return Math.max(minZ, widgetZ - 1);
      }
      return Math.max(minZ, Math.min(widgetZ - 5, maxZ));
    }

    function getAgilessonBackdropIframe() {
      var backdrop = document.querySelector('.didacticagilessonBackdrop--in');
      if (!backdrop) return null;
      return backdrop.querySelector(
        'iframe.didacticagilessonBackdrop__iframe,iframe[id^="didacticagilessonBackdrop__iframe_"]'
      );
    }

    function getSameOriginIframeDocument(iframe) {
      if (!iframe) return null;
      try {
        return iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document) || null;
      } catch (eIframe) {
        return null;
      }
    }

    function bindAgilessonIframeLifecycle(iframe) {
      if (!iframe || iframe.getAttribute('data-a11y-lifecycle-bound') === '1') return;
      iframe.setAttribute('data-a11y-lifecycle-bound', '1');
      iframe.addEventListener('load', function () {
        syncA11yToAgilessonIframe(iframe);
      });
    }

    function syncA11yToAgilessonIframe(optIframe) {
      var iframe = optIframe || getAgilessonBackdropIframe();
      if (!iframe) return;
      bindAgilessonIframeLifecycle(iframe);
      var iframeDoc = getSameOriginIframeDocument(iframe);
      if (!iframeDoc || !iframeDoc.documentElement || !iframeDoc.body) return;
      injectGlobalStyles(cfg, iframeDoc);
      applyToDocument(iframeDoc.documentElement, state, iframeDoc);
      bindEmbeddedFrameReadOnClick(iframeDoc);
      bindReadingMaskAgilessonIframeTracking();
    }

    function scheduleEmbeddedFrameSync() {
      if (readingMaskDomSyncTimer) return;
      readingMaskDomSyncTimer = global.setTimeout(function () {
        readingMaskDomSyncTimer = null;
        var open = isDidacticAgilessonBackdropOpen();
        if (open) {
          syncA11yToAgilessonIframe();
        }
        agilessonBackdropWasOpen = open;
        if (state.readingMask) {
          setReadingMaskEnabled(true);
        }
      }, 80);

    }

    function clearReadingMaskIframeTracking() {
      if (readingMaskIframeMoveTarget && readingMaskIframeMoveHandler) {
        try {
          readingMaskIframeMoveTarget.removeEventListener('mousemove', readingMaskIframeMoveHandler);
        } catch (eRm) {}
      }
      readingMaskIframeMoveTarget = null;
      readingMaskIframeMoveHandler = null;
    }

    function isDidacticAgilessonBackdropOpen() {
      return !!getAgilessonBackdropIframe();
    }

    function bindReadingMaskAgilessonIframeTracking() {
      clearReadingMaskIframeTracking();
      if (!state.readingMask || !isDidacticAgilessonBackdropOpen()) return;

      var iframe = getAgilessonBackdropIframe();
      if (!iframe) return;

      function attach(doc) {
        if (!doc || readingMaskIframeMoveTarget === doc) return;
        clearReadingMaskIframeTracking();
        readingMaskIframeMoveHandler = function (e) {
          if (!state.readingMask) return;
          var rect = iframe.getBoundingClientRect();
          setReadingMaskPosition(rect.top + (e.clientY || 0));
        };
        readingMaskIframeMoveTarget = doc;
        doc.addEventListener('mousemove', readingMaskIframeMoveHandler);
      }

      function tryAttach() {
        var doc = getSameOriginIframeDocument(iframe);
        if (doc && doc.body) attach(doc);
      }

      tryAttach();
    }

    function clearReadableMark() {
      if (!activeReadableEl) return;
      activeReadableEl.removeAttribute('data-a11y-reading-active');
      activeReadableEl = null;
    }

    function resolveSpeechWindow(optWin) {
      if (optWin && optWin.speechSynthesis && optWin.SpeechSynthesisUtterance) return optWin;
      return global;
    }

    function isElementNode(node) {
      return !!node && node.nodeType === 1;
    }

    function stopReadingSpeech(optWin) {
      clearReadableMark();
      var win = resolveSpeechWindow(optWin);
      if (win.speechSynthesis) win.speechSynthesis.cancel();
      if (speechSupported && synth && win !== global) synth.cancel();
    }

    function ensureCcOverlay() {
      if (ccOverlay) return;
      ccOverlay = document.createElement('div');
      ccOverlay.id = 'a11y-auto-cc-overlay';
      ccOverlay.style.cssText =
        'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);max-width:min(90vw,920px);' +
        'padding:8px 12px;border-radius:10px;background:rgba(0,0,0,.72);color:#fff;z-index:' +
        (cfg.zIndex - 2) +
        ';font:600 15px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;' +
        'text-align:center;pointer-events:none;display:none;box-shadow:0 6px 24px rgba(0,0,0,.28);';
      ccTextNode = document.createElement('div');
      ccOverlay.appendChild(ccTextNode);
      document.body.appendChild(ccOverlay);
    }

    function showCcText(text) {
      ensureCcOverlay();
      ccTextNode.textContent = text || '';
      ccOverlay.style.display = text ? 'block' : 'none';
    }

    function shortenCcText(text, maxChars) {
      var normalized = String(text || '').replace(/\s+/g, ' ').trim();
      if (!normalized) return '';
      if (normalized.length <= maxChars) return normalized;

      var cut = normalized.slice(normalized.length - maxChars);
      var sentenceBreak = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
      if (sentenceBreak > 12) {
        return cut.slice(sentenceBreak + 2).trim();
      }

      var wordBreak = cut.indexOf(' ');
      if (wordBreak > 0 && wordBreak < 20) {
        return cut.slice(wordBreak + 1).trim();
      }
      return cut.trim();
    }

    function clearCcText() {
      if (!ccOverlay) return;
      ccTextNode.textContent = '';
      ccOverlay.style.display = 'none';
    }

    function stopCcRecognition() {
      if (ccRecognizer) {
        try {
          ccRecognizer.onresult = null;
          ccRecognizer.onerror = null;
          ccRecognizer.onend = null;
          ccRecognizer.stop();
        } catch (e) {}
      }
      ccRecognizer = null;
      ccCurrentMedia = null;
      ccCurrentMode = '';
    }

    function stopCcVttMode() {
      if (ccVttMedia && ccVttTickHandler) {
        ccVttMedia.removeEventListener('timeupdate', ccVttTickHandler);
        ccVttMedia.removeEventListener('seeking', ccVttTickHandler);
        ccVttMedia.removeEventListener('ratechange', ccVttTickHandler);
      }
      ccVttMedia = null;
      ccVttTickHandler = null;
      if (ccCurrentMode === 'vtt') ccCurrentMode = '';
    }

    function extractMediaSrc(media) {
      if (!media) return '';
      return String(media.currentSrc || media.src || '').trim();
    }

    function getVttCandidates(media) {
      var src = extractMediaSrc(media);
      if (!src) return [];
      var clean = src.split('#')[0].split('?')[0];
      var dot = clean.lastIndexOf('.');
      if (dot === -1) return [];
      var base = clean.slice(0, dot);
      return [base + '.es.vtt', base + '.vtt'];
    }

    function parseVttTimestamp(raw) {
      var v = String(raw || '').trim().replace(',', '.');
      var parts = v.split(':');
      if (parts.length < 2) return NaN;
      var sec = 0;
      if (parts.length === 3) {
        sec += parseFloat(parts[0]) * 3600;
        sec += parseFloat(parts[1]) * 60;
        sec += parseFloat(parts[2]);
      } else {
        sec += parseFloat(parts[0]) * 60;
        sec += parseFloat(parts[1]);
      }
      return sec;
    }

    function parseVttContent(vttText) {
      var text = String(vttText || '').replace(/\r\n/g, '\n');
      var blocks = text.split('\n\n');
      var cues = [];
      for (var i = 0; i < blocks.length; i += 1) {
        var lines = blocks[i]
          .split('\n')
          .map(function (line) {
            return line.trim();
          })
          .filter(Boolean);
        if (!lines.length) continue;

        var timingIdx = -1;
        for (var j = 0; j < lines.length; j += 1) {
          if (lines[j].indexOf('-->') !== -1) {
            timingIdx = j;
            break;
          }
        }
        if (timingIdx === -1) continue;

        var timing = lines[timingIdx].split('-->');
        if (timing.length !== 2) continue;
        var start = parseVttTimestamp(timing[0]);
        var end = parseVttTimestamp(timing[1]);
        if (!isFinite(start) || !isFinite(end) || end <= start) continue;

        var cueText = lines.slice(timingIdx + 1).join(' ').trim();
        if (!cueText) continue;
        cues.push({ start: start, end: end, text: cueText });
      }
      return cues;
    }

    function findCueTextAt(cues, currentTime) {
      for (var i = 0; i < cues.length; i += 1) {
        var cue = cues[i];
        if (currentTime >= cue.start && currentTime <= cue.end) return cue.text;
      }
      return '';
    }

    function fetchVttText(url) {
      return fetch(url, { cache: 'no-store' }).then(function (res) {
        if (!res.ok) return null;
        return res.text();
      });
    }

    function loadSidecarVttCues(media) {
      var candidates = getVttCandidates(media);
      if (!candidates.length) return Promise.resolve([]);
      var idx = 0;
      function tryNext() {
        if (idx >= candidates.length) return Promise.resolve([]);
        var candidate = candidates[idx];
        idx += 1;
        return fetchVttText(candidate)
          .then(function (txt) {
            if (!txt) return tryNext();
            var cues = parseVttContent(txt);
            if (!cues.length) return tryNext();
            return cues;
          })
          .catch(function () {
            return tryNext();
          });
      }
      return tryNext();
    }

    function getTrackElementVttUrls(media) {
      var urls = [];
      if (!media || !media.querySelectorAll) return urls;
      var nodes = media.querySelectorAll('track');
      for (var i = 0; i < nodes.length; i++) {
        var tr = nodes[i];
        var kind = (tr.getAttribute('kind') || 'subtitles').toLowerCase();
        if (kind !== 'subtitles' && kind !== 'captions') continue;
        var s = tr.getAttribute('src');
        if (!s) continue;
        try {
          urls.push(new URL(s, global.location.href).href);
        } catch (e) {
          urls.push(s);
        }
      }
      return urls;
    }

    function fetchFirstVttCuesFromUrls(urls) {
      if (!urls || !urls.length) return Promise.resolve([]);
      var i = 0;
      function next() {
        if (i >= urls.length) return Promise.resolve([]);
        var u = urls[i];
        i += 1;
        return fetchVttText(u)
          .then(function (txt) {
            if (!txt) return next();
            var cues = parseVttContent(txt);
            if (!cues.length) return next();
            return cues;
          })
          .catch(function () {
            return next();
          });
      }
      return next();
    }

    function cuesFromTextTracks(media) {
      var out = [];
      if (!media || !media.textTracks) return out;
      for (var ti = 0; ti < media.textTracks.length; ti++) {
        var tt = media.textTracks[ti];
        if (tt.kind !== 'subtitles' && tt.kind !== 'captions') continue;
        var wasDisabled = tt.mode === 'disabled';
        if (wasDisabled) tt.mode = 'hidden';
        if (!tt.cues || tt.cues.length === 0) {
          if (wasDisabled) tt.mode = 'disabled';
          continue;
        }
        for (var j = 0; j < tt.cues.length; j++) {
          var c = tt.cues[j];
          var tx = String(c.text || '').replace(/\s+/g, ' ').trim();
          if (!tx) continue;
          out.push({ start: c.startTime, end: c.endTime, text: tx });
        }
        if (wasDisabled) tt.mode = 'disabled';
      }
      out.sort(function (a, b) {
        return a.start - b.start;
      });
      return out;
    }

    function waitForTextTrackCues(media, timeoutMs) {
      return new Promise(function (resolve) {
        var done = false;
        function finish() {
          if (done) return;
          done = true;
          resolve(cuesFromTextTracks(media));
        }
        function consider() {
          var c = cuesFromTextTracks(media);
          if (c.length) {
            finish();
            return true;
          }
          return false;
        }
        if (consider()) return;
        var tracks = media.querySelectorAll('track');
        if (!tracks.length) {
          finish();
          return;
        }
        var left = tracks.length;
        function oneDone() {
          left -= 1;
          if (consider()) return;
          if (left <= 0) finish();
        }
        for (var i = 0; i < tracks.length; i++) {
          tracks[i].addEventListener('load', oneDone, { once: true });
          tracks[i].addEventListener('error', oneDone, { once: true });
        }
        setTimeout(finish, timeoutMs);
      });
    }

    function loadVttCuesForMedia(media) {
      var src = extractMediaSrc(media);
      if (!src) {
        return fetchFirstVttCuesFromUrls(getTrackElementVttUrls(media)).then(function (cues) {
          if (cues && cues.length) return cues;
          return waitForTextTrackCues(media, 800);
        });
      }
      if (Object.prototype.hasOwnProperty.call(ccVttCache, src)) {
        return Promise.resolve(ccVttCache[src] || []);
      }

      return loadSidecarVttCues(media)
        .then(function (cues) {
          if (cues && cues.length) return cues;
          return fetchFirstVttCuesFromUrls(getTrackElementVttUrls(media));
        })
        .then(function (cues) {
          if (cues && cues.length) return cues;
          return waitForTextTrackCues(media, 800);
        })
        .then(function (cues) {
          var final = cues && cues.length ? cues : [];
          ccVttCache[src] = final;
          return final;
        });
    }

    function safeRecognitionStart(recognition, media) {
      try {
        if (media && (media.captureStream || media.mozCaptureStream)) {
          var stream = media.captureStream ? media.captureStream() : media.mozCaptureStream();
          var track = stream && stream.getAudioTracks && stream.getAudioTracks()[0];
          if (track) {
            recognition.start(track);
            return true;
          }
        }
      } catch (e) {}
      try {
        recognition.start();
        return true;
      } catch (e2) {
        return false;
      }
    }

    function startCcRecognitionForMedia(media) {
      if (!state.autoCC) return;
      if (!SpeechRecognitionCtor) return;
      if (!media || media.paused || media.ended) return;

      stopCcRecognition();
      clearCcText();

      var recognition = new SpeechRecognitionCtor();
      var lang = document.documentElement.lang || 'es-ES';
      recognition.lang = lang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = function (event) {
        var transcript = '';
        for (var i = event.resultIndex; i < event.results.length; i += 1) {
          var res = event.results[i];
          if (res && res[0] && res[0].transcript) transcript += res[0].transcript + ' ';
        }
        transcript = transcript.replace(/\s+/g, ' ').trim();
        showCcText(shortenCcText(transcript, 150));
      };

      recognition.onerror = function () {};
      recognition.onend = function () {
        if (!state.autoCC) return;
        if (!ccCurrentMedia || ccCurrentMedia.paused || ccCurrentMedia.ended) return;
        safeRecognitionStart(recognition, ccCurrentMedia);
      };

      ccRecognizer = recognition;
      ccCurrentMedia = media;
      ccCurrentMode = 'live';
      safeRecognitionStart(recognition, media);
    }

    function startCcFromVtt(media, cues) {
      stopCcVttMode();
      if (!media || !cues || !cues.length) return false;

      ccVttMedia = media;
      ccCurrentMedia = media;
      ccCurrentMode = 'vtt';

      ccVttTickHandler = function () {
        if (!ccVttMedia) return;
        var text = findCueTextAt(cues, ccVttMedia.currentTime || 0);
        showCcText(shortenCcText(text, 150));
      };
      ccVttMedia.addEventListener('timeupdate', ccVttTickHandler);
      ccVttMedia.addEventListener('seeking', ccVttTickHandler);
      ccVttMedia.addEventListener('ratechange', ccVttTickHandler);
      ccVttTickHandler();
      return true;
    }

    function startCcForMedia(media) {
      if (!state.autoCC) return;
      if (!media || media.paused || media.ended) return;
      var token = ++ccSessionToken;

      stopCcRecognition();
      stopCcVttMode();
      clearCcText();

      loadVttCuesForMedia(media).then(function (cues) {
        if (token !== ccSessionToken || !state.autoCC || !media || media.paused || media.ended) return;
        if (cues && cues.length) {
          startCcFromVtt(media, cues);
          return;
        }
        if (SpeechRecognitionCtor) startCcRecognitionForMedia(media);
      }).catch(function () {
        if (token !== ccSessionToken || !state.autoCC || !media || media.paused || media.ended) return;
        if (SpeechRecognitionCtor) startCcRecognitionForMedia(media);
      });
    }

    function bindMediaForCc(media) {
      if (!media || ccMediaBound.indexOf(media) !== -1) return;
      ccMediaBound.push(media);
      media.addEventListener('play', function () {
        if (!state.autoCC) return;
        startCcForMedia(media);
      });
      media.addEventListener('pause', function () {
        if (ccCurrentMedia === media) {
          stopCcRecognition();
          stopCcVttMode();
          clearCcText();
        }
      });
      media.addEventListener('ended', function () {
        if (ccCurrentMedia === media) {
          stopCcRecognition();
          stopCcVttMode();
          clearCcText();
        }
      });
    }

    function setupCcMediaBindings() {
      if (ccMediaListenerBound) return;
      ccMediaListenerBound = true;
      document.querySelectorAll('audio,video').forEach(bindMediaForCc);
      ccMediaObserver = new MutationObserver(function () {
        document.querySelectorAll('audio,video').forEach(bindMediaForCc);
      });
      ccMediaObserver.observe(document.body, { childList: true, subtree: true });
    }

    function setAutoCcEnabled(enabled) {
      setupCcMediaBindings();
      if (!enabled) {
        stopCcRecognition();
        stopCcVttMode();
        clearCcText();
        return;
      }
      var activeMedia = null;
      document.querySelectorAll('audio,video').forEach(function (media) {
        if (!activeMedia && !media.paused && !media.ended) activeMedia = media;
      });
      if (activeMedia) startCcForMedia(activeMedia);
    }

    function ensureReadingMaskOverlay() {
      if (readingMaskOverlay) return;
      readingMaskOverlay = document.createElement('div');
      readingMaskOverlay.id = 'a11y-reading-mask-overlay';
      readingMaskOverlay.style.cssText =
        'position:fixed;inset:0;pointer-events:none;z-index:' +
        getReadingMaskZIndex() +
        ';display:none;';

      readingMaskTop = document.createElement('div');
      readingMaskTop.style.cssText = 'position:absolute;left:0;right:0;top:0;background:rgba(0,0,0,.52);';

      readingMaskBottom = document.createElement('div');
      readingMaskBottom.style.cssText = 'position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.52);';

      readingMaskBand = document.createElement('div');
      readingMaskBand.style.cssText =
        'position:absolute;left:0;right:0;background:transparent;box-sizing:border-box;';

      readingMaskLineTop = document.createElement('div');
      readingMaskLineTop.style.cssText =
        'position:absolute;left:0;right:0;top:0;height:2px;background:var(--color-marca1);';

      readingMaskLineBottom = document.createElement('div');
      readingMaskLineBottom.style.cssText =
        'position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--color-marca1);';

      readingMaskBand.appendChild(readingMaskLineTop);
      readingMaskBand.appendChild(readingMaskLineBottom);
      readingMaskOverlay.appendChild(readingMaskTop);
      readingMaskOverlay.appendChild(readingMaskBottom);
      readingMaskOverlay.appendChild(readingMaskBand);
      document.body.appendChild(readingMaskOverlay);
    }

    function isElementVisible(el) {
      if (!el) return false;
      try {
        var cs = global.getComputedStyle(el);
        if (!cs) return false;
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        if (parseFloat(cs.opacity || '1') === 0) return false;
      } catch (e) {}
      try {
        if (el.getClientRects && el.getClientRects().length === 0) return false;
      } catch (e2) {}
      return true;
    }

    function isBlockingModalOpen() {
      // Detect only *actively open* dialogs. Moodle keeps modal shells and dialogue bases in the DOM.
      var i;
      var node;

      try {
        var bootstrapModals = document.querySelectorAll('.modal.show');
        for (i = 0; i < bootstrapModals.length; i += 1) {
          node = bootstrapModals[i];
          if (!isElementVisible(node)) continue;
          if (node.closest && node.closest('#a11y-widget-host')) continue;
          return true;
        }
      } catch (eModal) {}

      var backdrop = null;
      try {
        backdrop = document.querySelector('.modal-backdrop.show');
      } catch (eBackdrop) {
        backdrop = null;
      }
      if (backdrop && isElementVisible(backdrop)) return true;

      try {
        var moodleDialogues = document.querySelectorAll(
          '.moodle-dialogue-base .moodle-dialogue-wrap[role="dialog"]'
        );
        for (i = 0; i < moodleDialogues.length; i += 1) {
          node = moodleDialogues[i];
          if (node.classList.contains('moodle-dialogue-hidden') || node.classList.contains('hidden')) {
            continue;
          }
          if (!isElementVisible(node)) continue;
          if (node.closest && node.closest('#a11y-widget-host')) continue;
          return true;
        }
      } catch (eDialogue) {}

      try {
        var ariaModals = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
        for (i = 0; i < ariaModals.length; i += 1) {
          node = ariaModals[i];
          if (node.closest && node.closest('#a11y-widget-host')) continue;
          if (node.hasAttribute('hidden')) continue;
          if (node.getAttribute('aria-hidden') === 'true') continue;
          if (node.closest && node.closest('.modal') && !node.closest('.modal.show')) continue;
          if (!isElementVisible(node)) continue;
          return true;
        }
      } catch (eAria) {}

      return false;
    }

    function setReadingMaskPosition(cursorY) {
      ensureReadingMaskOverlay();
      var viewportHeight = Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 0);
      var bandHeight = Math.min(86, Math.max(64, Math.round(viewportHeight * 0.12)));
      var half = Math.round(bandHeight / 2);
      var y = typeof cursorY === 'number' ? cursorY : Math.round(viewportHeight * 0.45);
      var top = Math.max(0, Math.min(viewportHeight - bandHeight, y - half));
      var bottomTop = top + bandHeight;

      readingMaskTop.style.height = top + 'px';
      readingMaskBottom.style.top = bottomTop + 'px';
      readingMaskBottom.style.height = Math.max(0, viewportHeight - bottomTop) + 'px';
      readingMaskBand.style.top = top + 'px';
      readingMaskBand.style.height = bandHeight + 'px';
      readingMaskBand.style.background = 'transparent';
    }

    function setReadingMaskEnabled(enabled) {
      ensureReadingMaskOverlay();
      readingMaskOverlay.style.zIndex = String(getReadingMaskZIndex());
      // When Moodle opens a modal, keep the mask out of the way so the dialog is fully readable.
      var visible = enabled && !isBlockingModalOpen();
      readingMaskOverlay.style.display = visible ? 'block' : 'none';
      if (visible) {
        setReadingMaskPosition();
        bindReadingMaskAgilessonIframeTracking();
      } else {
        clearReadingMaskIframeTracking();
      }
    }

    // Keep reading mask and iframe a11y state in sync with Moodle modals and didacticagilesson backdrops.
    var readingMaskModalObserverBound = false;
    function bindReadingMaskModalObserver() {
      if (readingMaskModalObserverBound) return;
      readingMaskModalObserverBound = true;
      try {
        var mo = new MutationObserver(function () {
          scheduleEmbeddedFrameSync();
        });
        mo.observe(document.body, {
          attributes: true,
          attributeFilter: ['class', 'aria-hidden'],
          childList: true,
          subtree: true,
        });
      } catch (eMo) {}
    }

    function bindReadOnClickListeners(targetDoc) {
      if (!targetDoc || !targetDoc.documentElement) return;
      var marker = 'data-a11y-read-click-bound';
      if (targetDoc.documentElement.getAttribute(marker) === '1') return;
      targetDoc.documentElement.setAttribute(marker, '1');
      targetDoc.addEventListener('mousedown', onReadClickPointerDown, true);
      targetDoc.addEventListener('mouseup', onReadClickPointerUp, true);
    }

    function bindEmbeddedFrameReadOnClick(iframeDoc) {
      bindReadOnClickListeners(iframeDoc);
    }

    function normalizeSpeakText(text) {
      return String(text || '')
        .replace(/\s+/g, ' ')
        .replace(/[^\S\r\n]+/g, ' ')
        .trim();
    }

    function splitSpeakChunks(text, maxLen) {
      var words = text.split(' ');
      var chunks = [];
      var current = '';
      var i;
      for (i = 0; i < words.length; i += 1) {
        var word = words[i];
        if (!word) continue;
        if ((current + ' ' + word).trim().length > maxLen) {
          if (current) chunks.push(current);
          current = word;
        } else {
          current = (current ? current + ' ' : '') + word;
        }
      }
      if (current) chunks.push(current);
      return chunks;
    }

    function getSpeechRate(readOnClickMode) {
      if (readOnClickMode === 'fast') return 1.35;
      if (readOnClickMode === 'slow') return 0.7;
      return 1;
    }

    function primeSpeechSynthesis(win) {
      if (!win || !win.speechSynthesis) return;
      try {
        win.speechSynthesis.getVoices();
      } catch (ePrime) {}
    }

    function speakText(text, langOverride, optWin) {
      var normalized = normalizeSpeakText(text);
      if (!normalized) return;
      var lang = langOverride || document.documentElement.lang || 'es-ES';
      var chunks = splitSpeakChunks(normalized, 220);
      var rate = getSpeechRate(state.readOnClick);
      var primaryWin = resolveSpeechWindow(optWin);
      var fallbackWin = primaryWin !== global ? global : null;

      function speakInWindow(win) {
        if (!win || !win.speechSynthesis || !win.SpeechSynthesisUtterance) return false;
        primeSpeechSynthesis(win);
        win.speechSynthesis.cancel();
        chunks.forEach(function (chunk) {
          var utter = new win.SpeechSynthesisUtterance(chunk);
          utter.lang = lang;
          utter.rate = rate;
          utter.pitch = 1;
          win.speechSynthesis.speak(utter);
        });
        return true;
      }

      if (speakInWindow(primaryWin)) return;
      if (fallbackWin && speechSupported) speakInWindow(fallbackWin);
    }

    function isReadableElement(el) {
      if (!isElementNode(el)) return false;
      if (el.closest('#a11y-widget-host')) return false;
      if (el.closest('script,style,noscript,svg,canvas,video,audio,iframe')) return false;
      if (el.matches('button,input,select,textarea,[role="button"]')) return false;
      if (el.closest('button,input,select,textarea,[role="button"]') === el) return false;
      if (el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true') return false;
      return true;
    }

    var READABLE_LEAF_SELECTORS =
      'p,li,h1,h2,h3,h4,h5,h6,figcaption,blockquote,td,th,label,legend,dt,dd,' +
      '.form-control-static,.col-form-label,.fdescription,.text-muted,.alert,[role="heading"],[role="status"]';

    function findReadableElement(startEl) {
      if (!isReadableElement(startEl)) return null;
      var doc = startEl.ownerDocument;
      var leaf = startEl.closest(READABLE_LEAF_SELECTORS);
      if (leaf && isReadableElement(leaf)) {
        var leafText = getReadableText(leaf);
        if (leafText) return leaf;
      }

      var el = startEl;
      var best = null;
      var bestLen = Infinity;
      while (el && el !== doc.body && el !== doc.documentElement) {
        if (!isReadableElement(el)) {
          el = el.parentElement;
          continue;
        }
        var text = getReadableText(el);
        if (!text) {
          el = el.parentElement;
          continue;
        }
        if (text.length < bestLen) {
          bestLen = text.length;
          best = el;
        }
        el = el.parentElement;
      }
      return best;
    }

    function getReadableText(el) {
      if (!el) return '';
      var raw = el.innerText || el.textContent || '';
      return normalizeSpeakText(raw);
    }

    function applyStateAndPersist() {
      if (state.readOnClick === true) state.readOnClick = 'normal';
      if (state.readOnClick === false) state.readOnClick = 'off';
      if (state.readOnClick !== 'off' && !speechSupported) {
        state.readOnClick = 'off';
      }
      if (READ_CLICK_MODES.indexOf(state.readOnClick) === -1) {
        state.readOnClick = 'off';
      }
      state.autoCC = !!state.autoCC;
      state.readingMask = !!state.readingMask;
      if (SATURATION_OPTIONS.indexOf(state.saturation) === -1) {
        state.saturation = '';
      }
      if (state.activeProfile && !getProfileByKey(state.activeProfile)) {
        state.activeProfile = '';
      }
      state.profilesCollapsed = !!state.profilesCollapsed;
      state.cursorLarge = !!state.cursorLarge;
      state.dyslexiaFriendly = !!state.dyslexiaFriendly;
      applyToDocument(htmlEl, state);
      if (lastReadOnClickState && state.readOnClick === 'off') {
        stopReadingSpeech();
      }
      setAutoCcEnabled(state.autoCC);
      setReadingMaskEnabled(state.readingMask);
      syncA11yToAgilessonIframe();
      lastReadOnClickState = state.readOnClick !== 'off';
      saveState(cfg.storageKey, state);
      syncUI();
    }

    function syncUI() {
      var profilesWrap = root.querySelector('.profiles-wrap');
      var profilesToggle = root.querySelector('[data-act="toggle-profiles"]');
      if (profilesWrap) profilesWrap.setAttribute('data-collapsed', state.profilesCollapsed ? '1' : '0');
      if (profilesToggle) profilesToggle.setAttribute('aria-expanded', state.profilesCollapsed ? 'false' : 'true');

      root.querySelectorAll('[data-profile]').forEach(function (btn) {
        var profileKey = btn.getAttribute('data-profile');
        btn.setAttribute('data-on', state.activeProfile === profileKey ? '1' : '0');
      });
      root.querySelectorAll('[data-cycle]').forEach(function (btn) {
        var field = btn.getAttribute('data-cycle');
        if (!field) return;
        btn.setAttribute('data-on', isFieldActive(field, state) ? '1' : '0');
        var valueNode = btn.querySelector('[data-value="' + field + '"]');
        if (valueNode) valueNode.textContent = getFieldValueLabel(cfg, field, state);
        var iconNode = btn.querySelector('[data-icon="' + field + '"]');
        if (iconNode) iconNode.innerHTML = getFieldIconSvg(field, state);
      });
    }

    var open = false;

    function getFocusable() {
      return Array.prototype.slice
        .call(
          panel.querySelectorAll(
            'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        )
        .filter(function (el) {
          return el.offsetParent !== null || el === panel.querySelector('.close');
        });
    }

    function trapKeydown(e) {
      if (!open || e.key !== 'Tab') return;
      var list = getFocusable();
      if (!list.length) return;
      var first = list[0];
      var last = list[list.length - 1];
      var active = root.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function setOpen(v) {
      open = v;
      panel.hidden = !v;
      panel.setAttribute('data-open', v ? '1' : '0');
      fab.setAttribute('aria-expanded', v ? 'true' : 'false');
      if (v) {
        document.addEventListener('keydown', onDocKey);
        panel.addEventListener('keydown', trapKeydown);
        var closeBtn = panel.querySelector('.close');
        (closeBtn || panel).focus();
      } else {
        document.removeEventListener('keydown', onDocKey);
        panel.removeEventListener('keydown', trapKeydown);
        fab.focus();
      }
    }

    function onDocKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (state.readOnClick === 'off') return;
      state.readOnClick = 'off';
      applyStateAndPersist();
    });

    function onReadClickPointerDown(e) {
      if (state.readOnClick === 'off') return;
      readClickPointerStart = { x: e.clientX, y: e.clientY };
    }

    function onReadClickPointerUp(e) {
      if (state.readOnClick === 'off' || !readClickPointerStart) return;
      var dx = Math.abs(e.clientX - readClickPointerStart.x);
      var dy = Math.abs(e.clientY - readClickPointerStart.y);
      readClickPointerStart = null;
      if (dx > 5 || dy > 5) return;

      var target = e.target;
      if (!isElementNode(target)) return;
      if (target.closest('#a11y-widget-host')) return;

      var readable = findReadableElement(target);
      if (!readable) return;

      var text = getReadableText(readable);
      if (!text) return;

      clearReadableMark();
      activeReadableEl = readable;
      activeReadableEl.setAttribute('data-a11y-reading-active', '1');
      var eventWin = e && e.view ? e.view : global;
      speakText(text, undefined, eventWin);
    }

    bindReadOnClickListeners(document);

    document.addEventListener('mousemove', function (e) {
      if (!state.readingMask) return;
      setReadingMaskPosition(e.clientY);
    });

    window.addEventListener('resize', function () {
      if (!state.readingMask) return;
      setReadingMaskPosition();
    });

    syncUI();
    bindReadingMaskModalObserver();
    // Re-apply runtime-only effects on initial load (persisted state can say "on" even on a fresh page).
    setAutoCcEnabled(state.autoCC);
    setReadingMaskEnabled(state.readingMask);
    syncA11yToAgilessonIframe();

    root.addEventListener('click', function (e) {
      var target = e.target;
      if (!isElementNode(target)) return;
      var act = target.closest('[data-act]');
      if (!act) return;
      var action = act.getAttribute('data-act');
      if (action === 'toggle-panel') {
        setOpen(!open);
        return;
      }
      if (action === 'close') {
        setOpen(false);
        return;
      }
      if (action === 'toggle-profiles') {
        state.profilesCollapsed = !state.profilesCollapsed;
        applyStateAndPersist();
        return;
      }
      if (action === 'reset') {
        state = defaultState();
        applyStateAndPersist();
        return;
      }
    });

    root.addEventListener('click', function (e) {
      var profileBtn = e.target && e.target.closest && e.target.closest('[data-profile]');
      if (profileBtn) {
        var profileKey = profileBtn.getAttribute('data-profile');
        if (profileKey) {
          if (state.activeProfile === profileKey) {
            state = defaultState();
          } else {
            applyProfileToState(state, profileKey);
          }
          if (state.readOnClick !== 'off' && !speechSupported) {
            state.readOnClick = 'off';
            global.alert(t(cfg, 'ttsUnsupported'));
          }
          applyStateAndPersist();
        }
        return;
      }
    });

    root.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest && e.target.closest('[data-cycle]');
      if (!btn) return;
      var field = btn.getAttribute('data-cycle');
      if (!field || !Object.prototype.hasOwnProperty.call(state, field)) return;
      var prevReadOnClick = field === 'readOnClick' ? state.readOnClick : null;
      cycleFieldValue(field, state);
      state.activeProfile = '';
      var readClickUnsupported = false;
      if (field === 'readOnClick' && state.readOnClick !== 'off' && !speechSupported) {
        state.readOnClick = 'off';
        readClickUnsupported = true;
        global.alert(t(cfg, 'ttsUnsupported'));
      }
      applyStateAndPersist();
      if (
        field === 'readOnClick' &&
        speechSupported &&
        !readClickUnsupported &&
        prevReadOnClick !== null
      ) {
        var wasOff = prevReadOnClick === 'off';
        var isOff = state.readOnClick === 'off';
        if (wasOff && !isOff) speakText(I18N.es.readOnClickFeedbackOn, 'es-ES');
        else if (!wasOff && isOff) speakText(I18N.es.readOnClickFeedbackOff, 'es-ES');
        else if (!wasOff && !isOff && prevReadOnClick !== state.readOnClick) {
          if (state.readOnClick === 'normal') speakText(I18N.es.readOnClickFeedbackNormal, 'es-ES');
          else if (state.readOnClick === 'fast') speakText(I18N.es.readOnClickFeedbackFast, 'es-ES');
          else if (state.readOnClick === 'slow') speakText(I18N.es.readOnClickFeedbackSlow, 'es-ES');
        }
      }
    });

    global.__a11ySyncEmbeddedFrame = function (iframe) {
      syncA11yToAgilessonIframe(iframe || null);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);
