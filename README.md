
# System Dotfiles

![Camera Picture](./README.jpg)

Well, here we go again. I'm tired of unautomated shit, so this
is my repository where all the system profiles and their
configuration procedures are stored in.

I'm kind of an Arch Linux and an i3 fanboy, so you gotta deal
with it.

All profiles here have the shared idea of incrementally configuring
stuff, so the setup procedures can be used in partial, too.

If you have made changes and want to go back to OEM state,
just run `bash profiles/<hostname>.sh` again. That's the idea.

I also use a `synergy` multi-head setup where my Thinkpad is
the client to either `nuccy` or `weep` whereas both of my
desktop machines are airgapped and LUKS-encrypted on purpose.


## Profiles

**Intel NUC Homeserver (jarvis)**

Profile: [./profiles/jarvis.sh](./profiles/jarvis.sh)

- OEM Intel EFI
- Arch Linux
- Intel HD5000

**Intel NUC (nuccy)**

Profile: [./profiles/nuccy.sh](./profiles/nuccy.sh)

- OEM Intel EFI
- Arch Linux and i3
- Barrier Server (left of `tinky`)
- Monitor 1 (BenQ 24" HDMI 1920x1080)
- Monitor 2 (BenQ 24" DisplayPort 1920x1080)
- Monitor 3 (BenQ 24" DisplayPort 1920x1080)
- Intel HD4000
- Lenovo Thinkpad USB Keyboard US Layout (03X8715)
- Vertical Mouse (CSL 26069)
- (optional) Analog Audio Interface (Scarlet 2i2 USB) with Behringer C-3 microphone
- (optional) Analog Audio Headphones (AKG HD242)

**Thinkpad (tinky)**

Profile: [./profiles/tinky.sh](./profiles/tinky.sh)

- coreboot (or patched SeaBIOS 4.7)
- Arch Linux and i3
- Barrier Client (left of `weep`, right of `nuccy`)
- Monitor 1 (Internal 1440x900)
- Intel HD4000 and GT730M
- Lenovo Thinkpad Keyboard (US Layout)
- (optional) Bluetooth Audio Headphones (Cowin E8)

**Tower (weep/weeptarded)**

Profile: [./profiles/weep.sh](./profiles/weep.sh)

- coreboot
- Arch Linux and i3
- Barrier Server (right of `tinky`)
- Monitor 1 (BenQ 24" HDMI 1920x1080)
- Monitor 2 (BenQ 24" HDMI 1920x1080)
- (optional) Monitor 3 (BenQ 24" HDMI 1920x1080)
- 4x Radeon RX580 32GB (128GB VRAM memory)
- Webcam (Logitech C920)
- Cherry Strait 3.0 USB (JK-03 US Layout)
- Vertical Mouse (CSL 26069)

**HP Business Laptop (fury)**

Profile: [./profiles/fury.sh](./profiles/fury.sh)

- Arch Linux and i3
- Barrier Client (right of `weep`)


## Usage

The profiles are all available in [./profiles](./profiles).

If you want a custom username or email address, use the
optional export flow described here:

```bash
# Optionally set username and email
export USER="cookiengineer";
export EMAIL="cookiengineer@hahayougetspam.com";

# Required for AUR packages
sudo pacman -S base-devel;

# Look ma, no sudo!
bash ./profiles/nuccy.sh;
```

**Important Notes**

- The `id_rsa.pub` file is automatically generated when the `openssh` software is synchronized.
- The convention for the git repository paths is `~/Software/${orga_or_user}/${repo}`.
- There will be an instruction asking you to add the ssh key to GitHub, GitLab and Jarvis.
  If this isn't confirmed, it won't clone/update the repositories in `~/Software/**`.


## Debugging

The installation procedure can also be followed through
step-by-step using the [wizard.sh](./wizard.sh) script.

```bash
# Shows further install help
./wizard.sh install;

# Install software
./wizard.sh install software nodejs;

# Install AUR software
./wizard.sh install software-aur ungoogled-chromium-bin;

# Install own software (from this repository)
./wizard.sh install software-own auto-sleep;
```


## Notes

Available Profiles:

- [nuccy](./profiles/nuccy.sh)
- [tinky](./profiles/tinky.sh)
- [weep](./profiles/weep.sh)

Folder Structure:

- [./packages](./packages) contains all self-maintained [aur](https://aur.archlinux.org) packages.
- [./projects](./projects) contains github repository integrations.
- [./profiles](./profiles) contains ready-to-use profiles.
- [./shared](./shared) contains shared files among machines.
- [./software](./software) contains package integrations.


## License

[Cookie Engineer](https://github.com/cookiengineer)'s Dotfiles are released under the [WTFPL 2.0](./LICENSE_WTFPL.txt).

