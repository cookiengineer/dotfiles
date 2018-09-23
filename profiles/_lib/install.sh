#!/bin/bash

DEBUG_FLAG="false";
PROFILE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../" > /dev/null && pwd)";
DOTFILE_ROOT="$(dirname "$PROFILE_ROOT")";

if [ "$1" != "" ]; then
	PROFILE_ROOT="$PROFILE_ROOT/$1";
fi;

if [ "$2" == "--debug" ]; then
	DEBUG_FLAG="true";
fi;


echo "";
echo "+--------------------------------+";
echo "|   Cookie Engineer's Dotfiles   |";
echo "+--------------------------------+";
echo "|-> Dotfile: $DOTFILE_ROOT";
echo "|-> Profile: $PROFILE_ROOT";
echo "+--------------------------------+";
echo "|";


_install () {

	pkg_type="$1";
	pkg_name="$2";

	install_sh="$DOTFILE_ROOT/$pkg_type/$pkg_name/install.sh";
	configure_sh="$DOTFILE_ROOT/$pkg_type/$pkg_name/configure.sh";

	if [ -f "$install_sh" ]; then
		bash $install_sh;
	fi;

	if [ -f "$configure_sh" ]; then
		bash $configure_sh;
	fi;

}

_install_packages () {

	if [ "$DEBUG_FLAG" == "true" ]; then
		echo "|";
		echo "|-> sudo pacman -S --needed --noconfirm $@";
	fi;

	sudo pacman -S --needed --noconfirm $@;

}

_install_packages_aur () {

	if [ "$DEBUG_FLAG" == "true" ]; then
		echo "|";
		echo "|-> trizen -S --needed --noconfirm $@";
	fi;

	trizen -S --needed --noconfirm $@;

}

