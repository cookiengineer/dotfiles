#!/bin/bash

TOR_BIN=`which tor`;

if [ "$TOR_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm tor;

fi;

