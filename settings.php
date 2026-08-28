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
 * Settings for local_accessibilitywidget.
 *
 * @package    local_accessibilitywidget
 * @copyright  2026
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    $settings = new admin_settingpage('local_accessibilitywidget', get_string('pluginname', 'local_accessibilitywidget'));

    if ($ADMIN->fulltree) {
        $settings->add(new admin_setting_configcheckbox(
            'local_accessibilitywidget/enabled',
            get_string('enabled', 'local_accessibilitywidget'),
            get_string('enabled_desc', 'local_accessibilitywidget'),
            1
        ));

        $settings->add(new admin_setting_configselect(
            'local_accessibilitywidget/defaultlang',
            get_string('defaultlang', 'local_accessibilitywidget'),
            get_string('defaultlang_desc', 'local_accessibilitywidget'),
            'auto',
            [
                'auto' => get_string('defaultlang_auto', 'local_accessibilitywidget'),
                'es' => get_string('defaultlang_es', 'local_accessibilitywidget'),
                'en' => get_string('defaultlang_en', 'local_accessibilitywidget'),
            ]
        ));

        $settings->add(new admin_setting_configtext(
            'local_accessibilitywidget/zindex',
            get_string('zindex', 'local_accessibilitywidget'),
            get_string('zindex_desc', 'local_accessibilitywidget'),
            2147483000,
            PARAM_INT
        ));

        $settings->add(new admin_setting_configtext(
            'local_accessibilitywidget/storagekey',
            get_string('storagekey', 'local_accessibilitywidget'),
            get_string('storagekey_desc', 'local_accessibilitywidget'),
            'a11y-widget:v1',
            PARAM_TEXT
        ));
    }

    $ADMIN->add('localplugins', $settings);
}
