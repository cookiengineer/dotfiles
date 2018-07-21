#!/bin/bash

GIT_BIN=`which git`;

if [ "$GIT_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm git;

fi;

