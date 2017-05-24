#!/bin/bash

PROFILE=$(cd "$(dirname "$0")/"; pwd);

# LightDM
pacman -S --noconfirm --needed lightdm;

# GNOME
pacman -S --noconfirm --needed gnome-backgrounds gnome-bluetooth gnome-calculator gnome-calendar gnome-control-center gnome-desktop gnome-disk-utility gnome-font-viewer gnome-keyring gnome-maps gnome-menus gnome-mplayer gnome-online-accounts gnome-screenshot gnome-session gnome-settings-daemon gnome-shell gnome-system-monitor gnome-terminal gnome-tweak-tool;
pacman -S --noconfirm --needed gnome-shell-extension-dash-to-dock gnome-shell-extension-mediaplayer-git gnome-shell-extensions;

# Applications
pacman -S --noconfirm --needed abs git ffmpeg nmap nodejs npm openssh tor vim xterm;
pacman -S --noconfirm --needed chromium gimp gparted firefox quodlibet transmission-gtk;

# AUR Stuff
pacaur -S --noconfirm --needed firefox-noscript firefox-ublock-origin firefox-extension-https-everywhere;
pacaur -S --noconfirm --needed gtk-arc-flatabulous-theme-git gtk-theme-arc-git;
pacaur -S --noconfirm --needed inox-bin;


# System Configuration
tor_configured=$(cat /etc/tor/torrc | grep ClientUseIPv6);

if [ "$tor_configured" == "" ]; then
	echo -e "\nClientUseIPv6 1" >> /etc/tor/torrc;
	echo -e "\nClientPreferIPv6ORPort 1" >> /etc/tor/torrc;
fi;

systemctl enable sshd.service;
systemctl enable tor.service;

cp "$PROFILE/_etc/51-noto-color-emoji.conf" "/etc/fonts/conf.avail/51-noto-color-emoji.conf";
ln -s /etc/fonts/conf.avail/51-noto-color-emoji.conf /etc/fonts/conf.d/51-noto-color-emoji.conf;
fc-cache;

