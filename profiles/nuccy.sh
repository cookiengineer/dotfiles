#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";
ROOT="$(dirname "$DIR")";


_install () {

	pkg_type="$1";
	pkg_name="$2";

	install_sh="$ROOT/$pkg_type/$pkg_name/install.sh";
	configure_sh="$ROOT/$pkg_type/$pkg_name/configure.sh";

	if [ -f "$install_sh" ]; then
		bash $install_sh;
	fi;

	if [ -f "$configure_sh" ]; then
		bash $configure_sh;
	fi;

}

_install_packages () {
	sudo pacman -S --needed --noconfirm $@;
}

_install_packages_aur () {
	trizen -S --needed --noconfirm $@;
}


#
# XXX: MAIN software
#

_install software bash;
_install software gnome-shell;
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

