import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class VrrBlocker extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._blacklist = this._settings.get_strv('blacklist');
        this._isVrrBlocked = false;
        this._focusWindow = null;
        this._fullscreenSignal = null;

        this._focusWindowSignal = global.display.connect('notify::focus-window',
            () => this._updateFocusWindow()
        );
        this._settingsChangedSignal = this._settings.connect('changed::blacklist',
            () => this._updateSettings()
        );

        this._updateFocusWindow();
    }
    
    _updateFocusWindow() {
        const newFocusWindow = global.display.focus_window;

        if (this._focusWindow && this._fullscreenSignal) {
            this._focusWindow.disconnect(this._fullscreenSignal);
            this._fullscreenSignal = null;
        }
        
        this._focusWindow = newFocusWindow;
        
        if (this._focusWindow && this._isBlacklisted(this._focusWindow)) {
            this._fullscreenSignal = this._focusWindow.connect('notify::fullscreen',
                () => this._updateVrrBlockState()
            );
        }
        this._updateVrrBlockState();
    }

    _updateVrrBlockState() {
        const shouldBlockVrr = !!(
            this._focusWindow &&
            this._isBlacklisted(this._focusWindow) &&
            this._focusWindow.is_fullscreen()
        );
        
        if (shouldBlockVrr !== this._isVrrBlocked) {
            this._isVrrBlocked = shouldBlockVrr;
            if (shouldBlockVrr) {
                global.compositor.disable_unredirect();
                log('[VRR Blocker] VRR is blocked.');
            } else {
                global.compositor.enable_unredirect();
                log('[VRR Blocker] VRR is unblocked.');
            }
        }
    }
    
    _isBlacklisted(window) {
        if (!window) return false;
        const wmClass = window.get_wm_class() ?? "";
        return this._blacklist.includes(wmClass);
    }
    
    _updateSettings() {
        this._blacklist = this._settings.get_strv('blacklist');
        this._updateFocusWindow();
    }

    disable() {
        if (this._settingsChangedSignal) this._settings.disconnect(this._settingsChangedSignal);
        if (this._focusWindow && this._fullscreenSignal) {
            this._focusWindow.disconnect(this._fullscreenSignal);
        }
        if (this._focusWindowSignal) global.display.disconnect(this._focusWindowSignal);
        
        this._settings = null;
        this._blacklist = null;
        this._focusWindow = null;
        this._fullscreenSignal = null;
        this._focusWindowSignal = null;
        this._settingsChangedSignal = null;
        
        if (this._isVrrBlocked) {
            global.compositor.enable_unredirect();
            log('[VRR Blocker] VRR is unblocked.');
            this._isVrrBlocked = false;
        }
    }
}
