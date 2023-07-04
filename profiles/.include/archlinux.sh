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


is_pacman () {

	package="$1";
	result="$(pacman -Si $package 2> /dev/null)";

	# XXX: base-devel is a group. No idea how to fix
	if [ "$package" == "base-devel" ]; then
		return 0;
	fi;

	if [ "$result" != "" ]; then
		return 0;
	fi;

	return 1;

}

is_trizen () {

	TRIZEN_BIN=`which trizen`;

	if [ "$TRIZEN_BIN" != "" ]; then

		package="$1";
		result="$(trizen -Si $package 2> /dev/null)";

		if [ "$result" != "" ]; then
			return 0;
		fi;

	fi;

	return 1;

}

synchronize () {

	for package in "$@"
	do

		install_sh="$DOTFILE_ROOT/software/$package/install.sh";
		configure_sh="$DOTFILE_ROOT/software/$package/configure.sh";

		installed="no";

		if [ -f "$install_sh" ]; then

			if [ "$DEBUG_FLAG" == "true" ]; then
				echo "|";
				echo "|-> bash \"$install_sh\"";
			fi;

			bash "$install_sh";

			if [ "$?" == "0" ]; then
				installed="yes";
			fi;

		elif is_pacman $package; then

			if [ "$DEBUG_FLAG" == "true" ]; then
				echo "|";
				echo "|-> sudo pacman -S --needed --noconfirm $package";
			fi;

			sudo pacman -S --needed --noconfirm $package;

			if [ "$?" == "0" ]; then
				installed="yes";
			fi;

		elif is_trizen $package; then

			if [ "$DEBUG_FLAG" == "true" ]; then
				echo "|";
				echo "|-> trizen -S --needed --noconfirm $package";
			fi;

			trizen -S --needed --noconfirm $package;

			if [ "$?" == "0" ]; then
				installed="yes";
			fi;

		fi;

		if [ "$installed" == "yes" ] && [ -f "$configure_sh" ]; then

			if [ "$DEBUG_FLAG" == "true" ]; then
				echo "|";
				echo "|-> bash \"$configure_sh\"";
			fi;

			bash "$configure_sh";

		fi;

	done;

}

