#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";


NODEJS_BIN=`which node`;

if [ "$NODEJS_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm nodejs;

fi;


if [ ! -x /usr/bin/auto-lookup ]; then

	sudo cp "$DIR/auto-tagger.js" /usr/bin/auto-tagger;
	sudo chmod +x /usr/bin/auto-tagger;

fi;

