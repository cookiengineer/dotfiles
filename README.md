
# My System Profile(s)

Well, here we go again. I'm tired of unautomated shit, so this
is my repository where all the system profiles are stored in.

I'm kind of an ArchLinux / AntergOS and GNOME fanboy, so you
gotta deal with it. All devices here serve only on-demand, so
the setup is made for partial usage, too.


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


**Raspberry Pi2 (wuup)**

This Raspberry serves as a NAS, media server and mobile
backup of source code. It is solar powered and runs ArchLinux
for ARM.

- Analog Audio Interface


## Installation

The `installer.sh` can be used with a second parameter for the profile.

```bash
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

