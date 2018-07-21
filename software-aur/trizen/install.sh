#!/bin/bash

MAKEPKG_BIN=`which makepkg`;

if [ "$MAKEPKG_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm base-devel;

fi;


GIT_BIN=`which git`;
MAKEPKG_BIN=`which makepkg`;
TRIZEN_BIN=`which trizen`;

if [ "$TRIZEN_BIN" == "" ] && [ "$GIT_BIN" != "" ] && [ "$MAKEPKG_BIN" != "" ]; then

	TMP_DIR="/tmp/trizen";

	mkdir $TMP_DIR;
	cd $TMP_DIR;
	$GIT_BIN clone https://aur.archlinux.org/trizen.git $TMP_DIR;

	cd $TMP_DIR;
	$MAKEPKG_BIN -s;

	if [ $? == 0 ]; then

		cd $TMP_DIR;
		sudo pacman -U trizen-*.pkg.tar.xz;

	fi;

fi;

