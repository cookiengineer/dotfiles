#!/bin/bash

KITTY_BIN=`which kitty`;

if [ "$KITTY_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm kitty;

fi;

