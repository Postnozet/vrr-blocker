# VRR Blocker
An extension for GNOME Shell that blocks VRR (Variable Refresh Rate) for blacklisted apps by their WM_CLASS. It is mainly useful for preventing stuttering in browsers and video players when in fullscreen with VRR enabled.

## Note
This extension does not directly control VRR, but it disables unredirect fullscreen and keeps the compositor active for blacklisted apps, so VRR will not trigger.

## Manual Installation

### 1. Clone the repository
```bash
git clone https://github.com/Postnozet/vrr-blocker.git
```

### 2. Go into the directory
```bash
cd vrr-blocker
```

### 3. Create the directory
```bash
mkdir -p ~/.local/share/gnome-shell/extensions/vrr-blocker@postnozet
```

### 4. Copy files
```bash
cp -r * ~/.local/share/gnome-shell/extensions/vrr-blocker@postnozet/
```

### 5. Compile schemas
```bash
cd ~/.local/share/gnome-shell/extensions/vrr-blocker@postnozet
```

```bash
glib-compile-schemas schemas/
```

### 6. Enable the extension
Restart the session and enable it via an extension manager or using the command.
```bash
gnome-extensions enable vrr-blocker@postnozet
```

## Usage
Open the extension settings and add WM_CLASS values to the blacklist.
```bash
gnome-extensions prefs vrr-blocker@postnozet
```

## Compatibility
Tested and works on GNOME Shell 48, 49 and 50.
