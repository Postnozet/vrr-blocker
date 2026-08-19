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

        const addRow = new Adw.EntryRow({
            title: "Add WM_CLASS…"
        });
        addRow.add_css_class("monospace");

        const addButton = new Gtk.Button({
            icon_name: "list-add-symbolic",
            valign: Gtk.Align.CENTER,
            tooltip_text: "Add"
        });
        addButton.add_css_class("flat");
        addRow.add_suffix(addButton);

        const addEntry = () => {
            const value = addRow.get_text().trim();
            if (value.length === 0)
                return;

            const current = settings.get_strv('blacklist');
            if (current.includes(value)) {
                addRow.set_text('');
                return;
            }

            settings.set_strv('blacklist', [...current, value]);
            addRow.set_text('');
            updateList();
        };

        addButton.connect('clicked', addEntry);
        addRow.connect('entry-activated', addEntry);

        const itemRows = [];

        const updateList = () => {
            for (const row of itemRows)
                settingsGroup.remove(row);
            itemRows.length = 0;

            for (const value of settings.get_strv('blacklist')) {
                const row = new Adw.ActionRow({
                    title: value
                });
                row.add_css_class("monospace");

                const removeButton = new Gtk.Button({
                    icon_name: "list-remove-symbolic",
                    valign: Gtk.Align.CENTER,
                    tooltip_text: "Remove"
                });
                removeButton.add_css_class("flat");
                removeButton.connect('clicked', () => {
                    const updated = settings.get_strv('blacklist').filter(v => v !== value);
                    settings.set_strv('blacklist', updated);
                    updateList();
                });
                row.add_suffix(removeButton);

                settingsGroup.add(row);
                itemRows.push(row);
            }
        };
        
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

        settingsGroup.add(addRow);
        updateList();

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
