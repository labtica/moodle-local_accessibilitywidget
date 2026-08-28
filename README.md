# Accessibility Widget — Moodle local plugin

`local_accessibilitywidget` injects an accessibility widget (accessibility profiles, text-to-speech, subtitles, reading mask, typography/contrast adjustments, dyslexia-friendly mode and more) across every Moodle page via hooks.

## Install

Copy this folder to `local/accessibilitywidget` in your Moodle instance and run the installer (or `php admin/cli/upgrade.php`).

## Settings

Site administration → Plugins → Local plugins → Accessibility Widget:

- Enable widget
- Widget language (auto / Spanish / English)
- z-index
- LocalStorage key

## Privacy

No personal data is stored in Moodle. User preferences are persisted only in the browser's localStorage.

## Development / CI

GitHub Actions run the standard Moodle Plugin CI (`moodle-plugin-ci`) on push and pull requests: lint, code checker, PHPDoc, validation, savepoints, mustache, grunt, PHPUnit and Behat.
