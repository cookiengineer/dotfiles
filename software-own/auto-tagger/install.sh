#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";


ID3V2_BIN=`which id3v2`;

if [ "$ID3V2_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm id3v2;

fi;


NODEJS_BIN=`which node`;

if [ "$NODEJS_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm nodejs;

fi;


if [ ! -x /usr/bin/auto-tagger ]; then

	sudo cp "$DIR/auto-tagger.js" /usr/bin/auto-tagger;
	sudo chmod +x /usr/bin/auto-tagger;

fi;

