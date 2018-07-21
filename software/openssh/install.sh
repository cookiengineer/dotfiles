#!/bin/bash

SSH_BIN=`which ssh`;
GNOME_SHELL_BIN=`which gnome-shell`;
SEAHORSE_BIN=`which seahorse`;

if [ "$SSH_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm openssh;

fi;

if [ "$GNOME_SHELL_BIN" != "" ] && [ "$SEAHORSE_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm seahorse;

fi;

