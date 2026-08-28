<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Cadenas en español para local_accessibilitywidget.
 *
 * @package    local_accessibilitywidget
 * @copyright  2026
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['pluginname'] = 'Widget de Accesibilidad';

$string['enabled'] = 'Habilitar widget';
$string['enabled_desc'] = 'Si se desactiva, el widget de accesibilidad no se inyectará en ninguna página.';

$string['defaultlang'] = 'Idioma del widget';
$string['defaultlang_desc'] = 'Idioma usado por la interfaz del widget. "Auto" usa el idioma actual de Moodle (si no es inglés, cae a español).';
$string['defaultlang_auto'] = 'Auto (desde Moodle)';
$string['defaultlang_es'] = 'Español';
$string['defaultlang_en'] = 'Inglés';

$string['zindex'] = 'z-index';
$string['zindex_desc'] = 'z-index CSS usado por el widget flotante. Auméntalo si queda detrás de otros elementos.';

$string['storagekey'] = 'Clave de localStorage';
$string['storagekey_desc'] = 'Clave del navegador usada para persistir las preferencias del usuario.';

$string['privacy:metadata'] = 'Este plugin no almacena datos personales en Moodle. Solo guarda preferencias en el navegador del usuario (localStorage).';

