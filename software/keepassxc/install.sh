#!/bin/bash

KEEPASS_BIN=`which keepassxc`;

if [ "$KEEPASS_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm keepassxc;

fi;

