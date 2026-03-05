import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class VrrBlockerPrefs extends ExtensionPreferences {

    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        const prefsWindow = new Adw.PreferencesPage();
        
        // Settings
        const settingsGroup = new Adw.PreferencesGroup({
            title: "Blacklisted Apps"
        });
        const blacklistEntry = new Adw.EntryRow({
            title: "WM_CLASS values (comma separated)"
        });
        blacklistEntry.set_text(settings.get_strv('blacklist').join(', '));
        blacklistEntry.add_css_class("monospace");
        const saveButton = new Gtk.Button({
            label: "Save",
            margin_top: 12,
        });
        saveButton.add_css_class("suggested-action");
        saveButton.connect('clicked', () => {
            let values = blacklistEntry.get_text()
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);
            settings.set_strv('blacklist', values);
        });
        
        // Help
        const helpGroup = new Adw.PreferencesGroup({
            title: "How to check the WM_CLASS"
        });
        const step1 = new Gtk.Label({
            label: "1. Press <b>ALT + F2</b> and enter the command <tt><b>lg</b></tt>.",
            use_markup: true,
            xalign: 0,
            wrap: true
        });
        const step2 = new Gtk.Label({
            label: "2. Click the <b>Windows</b> tab.",
            use_markup: true,
            xalign: 0,
            wrap: true
        });
        const step3 = new Gtk.Label({
            label: "3. Find the desired app and check its <b>wmclass</b> value.",
            use_markup: true,
            xalign: 0,
            wrap: true
        });
        
        // Examples
        const examplesGroup = new Adw.PreferencesGroup({
            title: "Examples"
        });
        const examples = new Gtk.Label({
            label: "<tt>firefox, google-chrome, mpv, steam_app_1926680, org.gnome.Showtime</tt>",
            use_markup: true,
            xalign: 0,
            wrap: true,
            selectable: true
        });
        
        // Note
        const noteGroup = new Adw.PreferencesGroup({
            title: "Note"
        });
        const note = new Gtk.Label({
            label: "This extension does not directly control VRR, but it disables unredirect fullscreen " +
            "and keeps the compositor active for blacklisted apps, " +
            "so VRR will not trigger.",
            use_markup: true,
            xalign: 0,
            wrap: true,
        });

        settingsGroup.add(blacklistEntry);
        settingsGroup.add(saveButton);
        
        helpGroup.add(step1);
        helpGroup.add(step2);
        helpGroup.add(step3);
        examplesGroup.add(examples);
        noteGroup.add(note);

        prefsWindow.add(settingsGroup);
        prefsWindow.add(helpGroup);
        prefsWindow.add(examplesGroup);
        prefsWindow.add(noteGroup);

        window.add(prefsWindow);
    }
}
