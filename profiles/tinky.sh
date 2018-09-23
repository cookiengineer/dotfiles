#!/bin/bash

if [ "$1" == "--debug" ]; then
	source "$(dirname "$0")/_lib/install.sh" "tinky" "--debug";
else
	source "$(dirname "$0")/_lib/install.sh" "tinky";
fi;


#
# XXX: MAIN software
#

_install software bash;
_install software gnome-shell;
# _install software lightdm;
_install software networkmanager;
_install software modemmanager;
_install software git;
_install software openssh;
_install software nodejs;
_install software tor;
_install software vim;
_install software xterm;

_install_packages bluez bluez-firmware bluez-hid2hci bluez-libs bluez-utils;
_install_packages noto-fonts noto-fonts-compat;
_install_packages chromium firefox foxtrotgps gimp gparted transmission-gtk uget;
_install_packages ffmpeg gnome-mpv;
_install_packages dnsutils macchanger net-tools nmap;
_install_packages synergy;


#
# XXX: AUR software
#

_install software-aur trizen;
_install software-aur kitty;
_install software-aur wireless-regdb-pentest;

_install_packages_aur cplay redshift-gtk-git telegram-desktop-bin tldr youtube-dl;
_install_packages_aur firefox-extension-google-search-link-fix firefox-extension-https-everywhere firefox-extension-ublock-origin firefox-extension-umatrix;
_install_packages_aur gnome-shell-extension-dash-to-dock-git gnome-shell-extension-hidetopbar-git;
_install_packages_aur gtk-arc-flatabulous-theme-git;

# _install software-own apt-pac;
# _install software-own auto-cleanup;
_install software-own auto-tagger;
_install software-own chromium-extensions;
_install software-own pacman-server;


#
# XXX: GIT projects
#

_install projects cookiengineer;
_install projects Artificial-Engineering;
_install projects Artificial-University;
_install projects polyfillr;


#
# XXX: per-system configs
#

if [ ! -f /usr/bin/share-internet ]; then
	sudo cp $PROFILE_ROOT/usr/bin/share-internet.sh /usr/bin/share-internet;
	sudo chmod +x /usr/bin/share-internet;
fi;

local synergyc_service="/home/cookiengineer/.config/systemd/user/synergyc.service";
if [ ! -f $synergyc_service ]; then
	mkdir -p $(dirname $synergyc_service);
	cp "$PROFILE_ROOT$synergyc_service" $synergyc_service;
	systemctl --user enable synergyc;
fi;

