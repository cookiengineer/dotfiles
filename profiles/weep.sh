#!/bin/bash

if [ "$1" == "--debug" ]; then
	source "$(dirname "$0")/_lib/install.sh" "weep" "--debug";
else
	source "$(dirname "$0")/_lib/install.sh" "weep";
fi;


#
# XXX: MAIN software
#

_install software bash;
_install software gnome-shell;
_install software gdm;
_install software networkmanager;
_install software modemmanager;
_install software git;
_install software openssh;
_install software nodejs;
_install software tor;
_install software vim;
# _install software xterm;

_install_packages bluez bluez-firmware bluez-hid2hci bluez-libs bluez-utils;
_install_packages noto-fonts noto-fonts-compat;
_install_packages chromium firefox foxtrotgps gimp gparted transmission-gtk uget;
_install_packages ffmpeg gnome-mpv;
_install_packages dnsutils macchanger net-tools nmap veracrypt;
_install_packages openra;
_install_packages synergy;


#
# XXX: AUR software
#

_install software-aur trizen;
_install software-aur kitty;

_install_packages_aur cplay redshift-gtk-git telegram-desktop-bin tldr youtube-dl;
_install_packages_aur firefox-extension-google-search-link-fix firefox-extension-https-everywhere firefox-extension-ublock-origin firefox-extension-umatrix;
_install_packages_aur gnome-shell-extension-clipboard-indicator-git gnome-shell-extension-dash-to-dock-git gnome-shell-extension-hidetopbar-git gnome-shell-extension-pixel-saver-git;
_install_packages_aur gtk-arc-flatabulous-theme-git;
_install_packages_aur mobac openscad wireless-regdb-pentest;

# _install software-own apt-pac;
# _install software-own auto-cleanup;
_install software-own auto-tagger;
_install software-own chromium-extensions;
_install software-own pacman-backup;
# _install software-own pacman-server;


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

if [ ! -f /etc/synergy.conf ]; then
	sudo cp $PROFILE_ROOT/etc/synergy.conf /etc/synergy.conf;
fi;


sudo chmod +r /etc/NetworkManager/system-connections;

if [ ! -f /etc/NetworkManager/system-connections/Home ]; then
	sudo cp $PROFILE_ROOT/etc/NetworkManager/system-connections/Home /etc/NetworkManager/system-connections/Home;
fi;

local synergys_service="/home/cookiengineer/.config/systemd/user/synergys.service";
if [ ! -f $synergys_service ]; then
	mkdir -p $(dirname $synergys_service);
	cp "$PROFILE_ROOT$synergys_service" $synergys_service;
	systemctl --user enable synergys;
fi;

