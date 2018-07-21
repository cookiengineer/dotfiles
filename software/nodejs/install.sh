#!/bin/bash

NODEJS_BIN=`which node`;

if [ "$NODEJS_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm nodejs;

fi;


NPM_BIN=`which npm`;

if [ "$NPM_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm npm;

fi;


ESLINT_BIN=`which eslint`;

if [ "$ESLINT_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm eslint;

fi;

