#!/bin/bash

BARRIER_BIN=`which barriers`;

if [ "$BARRIER_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm barrier-headless;

fi;

