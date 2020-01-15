#!/bin/bash


if [ "$1" == "--debug" ]; then
	source "$(dirname "$0")/_lib/install.sh" "nuccy" "--debug";
else
	source "$(dirname "$0")/_lib/install.sh" "nuccy";
fi;


#
# XXX: MAIN software
#

_install software bash;
_install software gnome-shell;
_install software gdm;
_install software networkmanager;
# _install software modemmanager;
_install software git;
_install software openssh;
_install software nodejs;
_install software tor;
_install software vim;

_install_packages bluez bluez-firmware bluez-libs bluez-utils;
_install_packages gnome-shell-extensions gnome-shell-extension-appindicator gnome-shell-extension-dash-to-dock;
_install_packages noto-fonts noto-fonts-compat noto-fonts-emoji;
_install_packages chromium firefox gimp gparted transmission-gtk uget;
_install_packages ffmpeg celluloid;
_install_packages dnsutils macchanger net-tools nmap;
# _install_packages openra;
_install_packages synergy;
# _install_packages veracrypt;



#
# XXX: AUR software
#

_install software-aur trizen;
# _install software-aur kitty;
_install software-aur wireless-regdb-pentest;

_install_packages_aur telegram-desktop-bin tldr youtube-dl;
_install_packages_aur firefox-extension-google-search-link-fix firefox-extension-https-everywhere firefox-extension-ublock-origin firefox-extension-umatrix;
_install_packages_aur mobac;
_install_packages_aur openscad;

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
# XXX: System config
#

sudo chmod +r /etc/NetworkManager/system-connections;

local home_connection="/etc/NetworkManager/system-connections/Home.nmconnection";
if [ ! -f $home_connection ]; then
	sudo cp "$PROFILE_ROOT$home_connection" $home_connection;
fi;



if [ ! -f /etc/synergy.conf ]; then
	sudo cp $PROFILE_ROOT/etc/synergy.conf /etc/synergy.conf;
fi;

local synergys_service="/home/cookiengineer/.config/systemd/user/synergys.service";
if [ ! -f $synergys_service ]; then
	mkdir -p $(dirname $synergys_service);
	cp "$PROFILE_ROOT$synergys_service" $synergys_service;
	systemctl --user enable synergys;
fi;

