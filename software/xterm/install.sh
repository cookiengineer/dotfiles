#!/bin/bash

XTERM_BIN=`which xterm`;

if [ "$XTERM_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm xterm;

fi;

