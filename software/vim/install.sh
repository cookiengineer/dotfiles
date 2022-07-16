#!/bin/bash

VIM_BIN=`which vim`;

if [ "$VIM_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm vim vimpager;

fi;

