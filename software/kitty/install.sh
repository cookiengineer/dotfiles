#!/bin/bash

GIT_BIN=`which git`;
MAKEPKG_BIN=`which makepkg`;
TRIZEN_BIN=`which trizen`;

if [ "$TRIZEN_BIN" != "" ]; then

	$TRIZEN_BIN -S --needed --noconfirm kitty;

elif [ "$GIT_BIN" != "" ] && [ "$MAKEPKG_BIN" != "" ]; then

	TMP_DIR="/tmp/kitty";

	mkdir $TMP_DIR;
	cd $TMP_DIR;
	$GIT_BIN clone https://aur.archlinux.org/kitty.git $TMP_DIR;

	cd $TMP_DIR;
	$MAKEPKG_BIN -s;

	if [ $? == 0 ]; then

		cd $TMP_DIR;
		sudo pacman -U kitty-*.pkg.tar.xz;

	fi;

fi;

