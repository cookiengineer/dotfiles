#!/bin/bash


if [ "$1" == "--debug" ]; then
	source "$(dirname "$0")/_lib/install.sh" "weep" "--debug";
else
	source "$(dirname "$0")/_lib/install.sh" "weep";
fi;


#
# XXX: MAIN software
#

_install software bash base-devel;
_install software-own i3-desktop;

_install software barrier-headless;
_install software networkmanager;
# _install software modemmanager;
_install software git;
_install software openssh;
_install software nodejs;
_install software tor;
_install software kitty;
_install software vim;
# _install software keepassxc;

# _install_packages bluez bluez-firmware bluez-libs bluez-utils;
_install_packages noto-fonts noto-fonts-compat noto-fonts-emoji;
_install_packages chromium firefox gimp gparted transmission-gtk uget;
_install_packages ffmpeg celluloid;
_install_packages dnsutils macchanger net-tools nmap;
_install_packages openra;
# _install_packages telegram-desktop;


#
# XXX: AUR software
#

_install software-aur trizen;
_install software-aur ly;
# _install software-aur ungoogled-chromium-bin;
# _install software-aur wireless-regdb-pentest;

_install_packages_aur tldr youtube-dl;
_install_packages_aur mobac;
_install_packages_aur openscad;

# _install software-own apt-pac;
# _install software-own auto-sleep;
_install software-own auto-tagger;
_install software-own chromium-extensions;
_install software-own pacman-backup;
# _install software-own pacman-server;


#
# XXX: GIT projects
#

_install projects cookiengineer;
_install projects tholian-network;


#
# XXX: System config
#

sudo chmod +r /etc/NetworkManager/system-connections;

home_connection="/etc/NetworkManager/system-connections/Home.nmconnection";
if [[ ! -f "$home_connection" ]]; then
	sudo cp "$PROFILE_ROOT$home_connection" $home_connection;
fi;

i3status_conf="/home/cookiengineer/.config/i3status/config";
if [[ ! -f "$i3status_conf" ]]; then
	mkdir -p $(dirname $i3status_conf);
	cp "$PROFILE_ROOT$i3status_conf" $i3status_conf;
fi;

systemctl --user enable barrier-server;

