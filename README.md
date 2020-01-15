
# System Dotfiles

![Camera Picture](./README.jpg)

Well, here we go again. I'm tired of unautomated shit, so this
is my repository where all the system profiles and their
configuration procedures are stored in.

I'm kind of an Arch Linux, Manjaro and GNOME fanboy, so you
gotta deal with it. All profiles here have the shared idea
of incrementally configuring stuff, so the setup procedures
can be used in partial, too.

Most likely there's `kitty` Terminal and `vim` installed
everywhere, as that's my preferred development environment.


## Profiles

**Intel NUC (nuccy)**

Profile: [./profiles/nuccy.sh](./profiles/nuccy.sh)

- Manjaro Linux and GNOME
- Synergy Server (left of `tinky`)
- Monitor 1 (BenQ 24" HDMI 1920x1080)
- Monitor 2 (BenQ 24" DisplayPort 1920x1080)
- Monitor 3 (BenQ 24" DisplayPort 1920x1080)
- Intel HD4000
- Keyboard (Cherry KC1000 US Layout)
- Vertical Mouse (CSL 26069)

**Tower (weep)**

Profile: [./profiles/weep.sh](./profiles/weep.sh)

- Manjaro Linux and GNOME
- Synergy Server (left of `tinky`)
- Monitor 1 (BenQ 24" HDMI 1920x1080)
- Monitor 2 (BenQ 24" HDMI 1920x1080)
- Monitor 3 (BenQ 24" HDMI 1920x1080)
- Radeon HD6000 and 2x GTX 1080Ti
- Webcam (Logitech C920)
- Keyboard (Cherry KC1000 US Layout)
- Vertical Mouse (CSL 26069)
- Analog Audio Interface (Scarlet 2i2 USB) with Behringer C-3 microphone
- Analog Audio Headphones (AKG HD242)

**Thinkpad (tinky)**

Profile: [./profiles/tinky.sh](./profiles/tinky.sh)

- Manjaro Linux and GNOME
- Synergy Client (right of `weep`, right of `nuccy`)
- Monitor 1 (Internal 1440x900)
- Monitor 2 (BenQ 24" DisplayPort 1920x1080)
- Intel HD4000 and GT730M
- Lenovo Thinkpad Keyboard (US Layout)


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

Afterwards, the `id_rsa.pub` file will be generated
if it doesn't exist - so it has to be added to the
GitHub account:

```bash
# Add this Public Key to BitBucket, GitHub and GitLab
cat ~/.ssh/id_rsa.pub;
```


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

- [./profiles](./profiles) contains ready-to-use profiles.
- [./projects](./projects) contains github organization and repository integrations.
- [./packages-aur](./packages-aur) contains all self-maintained [aur](https://aur.archlinux.org) packages.
- [./software](./software) contains package integrations for `core`, `community`, `extra` and `multilib`.
- [./software-aur](./software-aur) contains package integrations for [aur.archlinux.org](https://aur.archlinux.org).
- [./software-own](./software-own) contains custom helpers that have no upstream packages.


## License

[Cookie Engineer](https://github.com/cookiengineer)'s Dotfiles are released under the [WTFPL 2.0](./LICENSE_WTFPL.txt).

