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
# _install software lightdm;
_install software networkmanager;
# _install software modemmanager;
_install software git;
_install software openssh;
_install software nodejs;
_install software tor;
_install software vim;
_install software xterm;

_install_packages noto-fonts noto-fonts-compat;
_install_packages chromium firefox gimp gparted transmission-gtk uget;
_install_packages ffmpeg gnome-mpv;
_install_packages dnsutils macchanger net-tools nmap;



#
# XXX: AUR software
#

_install software-aur trizen;
_install software-aur kitty;
_install software-aur wireless-regdb-pentest;

_install_packages_aur cplay redshift-gtk-git telegram-desktop-bin tldr youtube-dl;
_install_packages_aur firefox-extension-google-search-link-fix firefox-extension-https-everywhere firefox-extension-ublock-origin firefox-extension-umatrix;

# _install software-own apt-pac;
# _install software-own auto-cleanup;
_install software-own auto-tagger;
_install software-own chromium-extensions;
# _install software-own pacman-server;


#
# XXX: GIT projects
#

_install projects cookiengineer;
_install projects Artificial-Engineering;
_install projects Artificial-University;
_install projects polyfillr;

