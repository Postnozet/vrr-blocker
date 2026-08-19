# VRR Blocker
An extension for GNOME Shell that blocks VRR (Variable Refresh Rate) for blacklisted apps by their WM_CLASS. It is mainly useful for preventing flickering and stuttering in browsers and video players when in fullscreen with VRR enabled.

## Note
This extension does not directly control VRR, but it disables unredirect fullscreen and keeps the compositor active for blacklisted apps, so VRR will not trigger.

## Manual Installation

### 1. Clone the repository to the extension directory
```bash
git clone https://github.com/Postnozet/vrr-blocker.git ~/.local/share/gnome-shell/extensions/vrr-blocker@postnozet
```

### 2. Compile schemas
```bash
glib-compile-schemas ~/.local/share/gnome-shell/extensions/vrr-blocker@postnozet/schemas/
```

### 3. Enable the extension
Restart the GNOME Shell session, then run:
```bash
gnome-extensions enable vrr-blocker@postnozet
```

## Usage
Open the extension settings to add WM_CLASS values to the blacklist:
```bash
gnome-extensions prefs vrr-blocker@postnozet
```
