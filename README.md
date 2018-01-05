
# My System Profile(s)

Well, here we go again. I'm tired of unautomated shit, so this
is my repository where all the system profiles are stored in.

I'm kind of an Arch Linux and GNOME fanboy, so you gotta deal
with it. All devices here serve only on-demand, so the setup
is made for partial usage, too.


## Devices

**Mini PC (woop)**

This is my development machine. It is also the `xdmx` client
for the screencast recording setup, where the `weep` machine
is the server.

- Monitor 1 (BenQ 24" DisplayPort 1920x1080)
- Monitor 2 (BenQ 24" DisplayPort 1920x1080)
- Monitor 3 (BenQ 24" HDMI 1920x1080)
- Keyboard (Cherry JK0340 US Layout)
- Trackball (Kensington Orbit)

**Tower (weep)**

This is my computing machine for the hardcore AI / ML shit.
It also has a webcam connected and serves as a peer-synced
[lychee.js](https://lychee.js.org) Harvester instance.

- Monitor (VGA 1280x1024)
- Projector (DVI / HDMI 1920x1080)
- Webcam (Logitech C920)
- Analog Audio Interface (Scarlet 2i2 USB)

**Raspberry Pi2 (wiip-XX)**

These Raspberry Pis are connected in a cluster and serve as
peer-synced [lychee.js](https://lychee.js.org) Harvester
instances. No hardware connected, just ArchLinux for ARM
and local network access.

**Thinkpad (wuup)**

An old Thinkpad I had laying around, it serves as my laptop
for presentations of my courses at University.

- Monitor 1 (internal 1440x900)
- Monitor 2 (Projector 1024x768 VGA)
- German keyboard mapped as US keyboard

**Thinkpad (tinky)**

A new Thinkpad I repaired and reanimated, it serves as my laptop
for coding AI- and ML-related stuff.

- Monitor 1 (internal 1366x768)
- Monitor 2 (external 1920x1080)
- German keyboard mapped as US keyboard

## Installation

The `installer.sh` can be used with a second parameter for the profile.

```bash
# Preparations: install trizen

sudo pacman -S curl git;
git clone https://aur.archlinux.org/trizen.git /tmp/trizen;
cd /tmp/whatever;
makepkg -s;

# After trizen was installed, do this:

export USER="your-user-name";
export EMAIL="your-email@server.tld";

install.sh woop;
```

A few manual steps are required:

```bash
# Add this Public Key to GitHub
cat ~/.ssh/id_rsa.pub;


# Start VIM and enter :VundleInstall
vim;
```


## Automatic Backup and Restore

These dotfiles will also install the `autobackup` tool which is there to
export and import all git repositories that are tracked in `~/BACKUP`.

The shell script itself contains the list of files, mirrors and
repositories; so you should modify it to your needs.

Here's the workflow usage:

```bash
# Sync local repos with origins
autobackup;

# Export backup to USB stick
autobackup --export /run/media/cookiengineer/usb_stick/whatever;

# ... Go to other Machine ...

# Import backup from USB stick
autobackup --import /run/media/cookiengineer/usb_stick/whatever;

# ... Go to other (unconfigured) Machine ...

# Import backup from USB stick
cd /run/media/cookiengineer/usb_stick/whatever;

chmod +x ./autobackup.sh;
./autobackup.sh --import $(pwd);
```


## Work in Progress

Remote server backups are a bit overcomplicated right now. So this
has still to be integrated nicely.

Example for backup scenario:

```bash
ssh root@git-mirror 'cd /; tar -cvpzf - --exclude=/lost+found --exclude=/dev --exclude=/mnt --exclude=/proc --exclude=/run --exclude=/sys --one-file-system /' > /home/cookiengineer/git-mirror-backup.tar.gz
```

