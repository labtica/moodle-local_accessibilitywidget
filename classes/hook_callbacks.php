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

namespace local_accessibilitywidget;

use core\hook\output\before_footer_html_generation;

/**
 * Hook callbacks for local_accessibilitywidget.
 *
 * @package    local_accessibilitywidget
 * @copyright  2026
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class hook_callbacks {
    /** Default z-index used by the widget. */
    private const DEFAULT_ZINDEX = 2147483000;

    /** Default localStorage key used by the widget. */
    private const DEFAULT_STORAGE_KEY = 'a11y-widget:v1';

    /**
     * Inject the widget config and enqueue its JS.
     *
     * @param before_footer_html_generation $hook
     */
    public static function before_footer_html_generation(before_footer_html_generation $hook): void {
        global $PAGE;

        if (during_initial_install()) {
            return;
        }

        // Do not render in layouts where UI injection is problematic.
        if (in_array($PAGE->pagelayout, ['maintenance', 'print', 'redirect', 'embedded'])) {
            return;
        }

        if (!self::is_enabled()) {
            return;
        }

        // Detectar si estamos en una página de edición compleja
        $scriptname = basename($_SERVER['SCRIPT_NAME'] ?? '', '.php');
        $isEditingPage = in_array($scriptname, ['edit', 'editsection', 'course_edit', 'modedit', 'course']);
        
        $config = self::get_widget_config();
        // Agregar flag de modo ligero para páginas complejas
        $config['lightMode'] = $isEditingPage;
        
        // Provide the runtime config to the vanilla JS widget.
        $js = 'window.a11yWidgetConfig = ' . json_encode($config, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . ';';
        $hook->add_html(\html_writer::tag('script', $js, ['type' => 'text/javascript', 'data-accessibilitywidget' => 'config']));

        // Enqueue the widget script (loaded in the footer by default).
        $PAGE->requires->js('/local/accessibilitywidget/a11y-widget.js');
    }

    /**
     * Whether the plugin is enabled.
     *
     * @return bool
     */
    private static function is_enabled(): bool {
        $enabled = get_config('local_accessibilitywidget', 'enabled');
        if ($enabled === false) {
            // Default to enabled if the admin setting has never been saved.
            return true;
        }
        return (bool) $enabled;
    }

    /**
     * Build the config object expected by a11y-widget.js.
     *
     * @return array
     */
    private static function get_widget_config(): array {
        $lang = self::resolve_lang((string) get_config('local_accessibilitywidget', 'defaultlang'));
        $storagekey = trim((string) get_config('local_accessibilitywidget', 'storagekey'));
        $zindex = (int) get_config('local_accessibilitywidget', 'zindex');

        if ($storagekey === '') {
            $storagekey = self::DEFAULT_STORAGE_KEY;
        }
        if ($zindex <= 0) {
            $zindex = self::DEFAULT_ZINDEX;
        }

        $assetbaseurl = rtrim((new \moodle_url('/local/accessibilitywidget/'))->out(false), '/') . '/';

        return [
            'lang' => $lang,
            'storageKey' => $storagekey,
            'zIndex' => $zindex,
            'assetBaseUrl' => $assetbaseurl,
        ];
    }

    /**
     * Resolve the widget language (only supports es/en).
     *
     * @param string $setting
     * @return string
     */
    private static function resolve_lang(string $setting): string {
        $setting = strtolower(trim($setting));

        if ($setting === 'en' || $setting === 'es') {
            return $setting;
        }

        $current = strtolower((string) current_language());
        if (str_starts_with($current, 'en')) {
            return 'en';
        }

        return 'es';
    }
}

