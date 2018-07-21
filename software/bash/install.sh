#!/bin/sh

BASH_BIN=`which bash`;

if [ "$BASH_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm bash;

fi;

