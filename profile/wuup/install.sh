#!/bin/bash

PROFILE=$(cd "$(dirname "$0")/"; pwd);

# LightDM
pacman -S --noconfirm --needed lightdm;

# GNOME
pacman -S --noconfirm --needed gnome-backgrounds gnome-bluetooth gnome-calculator gnome-calendar gnome-control-center gnome-desktop gnome-disk-utility gnome-font-viewer gnome-keyring gnome-maps gnome-menus gnome-mplayer gnome-online-accounts gnome-screenshot gnome-session gnome-settings-daemon gnome-shell gnome-system-monitor gnome-terminal gnome-themes-standard gnome-tweak-tool;
pacman -S --noconfirm --needed gnome-shell-extension-dash-to-dock gnome-shell-extension-mediaplayer-git gnome-shell-extension-status-menu-buttons gnome-shell-extensions;

# Applications
pacman -S --noconfirm --needed abs cups git ffmpeg nmap nodejs npm openssh tor vim;
pacman -S --noconfirm --needed chromium evolution gimp gparted firefox quodlibet transmission-gtk;

# Stuff
# pacman -S --noconfirm --needed gtk-theme-arc xorg-server-xdmx;
pacman -S --noconfirm --needed yaourt;

# AUR Stuff
yaourt -S --noconfirm --needed arc-firefox-theme firefox-noscript firefox-ublock-origin firefox-extension-https-everywhere;
yaourt -S --noconfirm --needed gtk-arc-flatabulous-theme-git gtk-theme-arc-git;
yaourt -S --noconfirm --needed inox-bin;


# System Configuration
tor_configured=$(cat /etc/tor/torrc | grep ClientUseIPv6);

if [ "$tor_configured" == "" ]; then
	echo -e "\nClientUseIPv6 1" >> /etc/tor/torrc;
	echo -e "\nClientPreferIPv6ORPort 1" >> /etc/tor/torrc;
fi;

systemctl enable sshd.service;
systemctl enable tor.service;

cat "$PROFILE/_etc/51-noto-color-emoji.conf" > "/etc/fonts/conf.avail/51-noto-color-emoji.conf";
ln -s /etc/fonts/conf.avail/51-noto-color-emoji.conf /etc/fonts/conf.d/51-noto-color-emoji.conf;
fc-cache;

