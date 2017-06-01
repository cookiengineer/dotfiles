#!/bin/bash

PROFILE=$(cd "$(dirname "$0")/"; pwd);

# GNOME
sudo pacman -S --noconfirm --needed base-devel lightdm;
sudo pacman -S --noconfirm --needed gnome-bluetooth gnome-calculator gnome-calendar gnome-control-center gnome-desktop gnome-disk-utility gnome-font-viewer gnome-keyring gnome-maps gnome-menus gnome-mplayer gnome-online-accounts gnome-screenshot gnome-session gnome-settings-daemon gnome-shell gnome-system-monitor gnome-terminal gnome-tweak-tool;

# Stuff
sudo pacman -S --noconfirm --needed abs git ffmpeg nmap nodejs npm openssh tor vim xterm;
sudo pacman -S --noconfirm --needed chromium gimp gparted firefox transmission-gtk;
sudo pacman -S --noconfirm --needed noto-fonts noto-fonts-emoji;

# AUR Stuff
gpg --recv-key 1EB2638FF56C0C53;
gpg --recv-key EA9DBF9FB761A677;
pacaur -S --noconfirm --needed gnome-shell-extension-dash-to-dock gnome-shell-extension-mediaplayer-git gnome-shell-extension-hidetopbar-git;
pacaur -S --noconfirm --needed firefox-noscript firefox-ublock-origin firefox-extension-https-everywhere;
pacaur -S --noconfirm --needed numix-circle-icon-theme-git gtk-theme-arc-flatabulous-git cplay inox-bin redshift-minimal cairo-coloredemoji;
pacaur -S --noconfirm --needed youtube-dl;


# System Configuration
tor_configured=$(cat /etc/tor/torrc | grep ClientUseIPv6);

if [ "$tor_configured" == "" ]; then
	sudo echo -e "\nClientUseIPv6 1" >> /etc/tor/torrc;
	sudo echo -e "\nClientPreferIPv6ORPort 1" >> /etc/tor/torrc;
fi;

sudo systemctl enable sshd.service;
sudo systemctl enable tor.service;

sudo cp "$PROFILE/../_etc/01-noto-color-emoji.conf" "/etc/fonts/conf.avail/01-noto-color-emoji.conf";
sudo ln -s /etc/fonts/conf.avail/01-noto-color-emoji.conf /etc/fonts/conf.d/01-noto-color-emoji.conf;
sudo fc-cache;
fc-cache;

