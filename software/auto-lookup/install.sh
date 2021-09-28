#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";


if [[ "$(which node 2>/dev/null)" == "" ]]; then
	sudo pacman -S --needed --noconfirm nodejs;
fi;


if [ ! -x /usr/bin/auto-lookup ]; then

	sudo cp "$DIR/auto-tagger.js" /usr/bin/auto-tagger;
	sudo chmod +x /usr/bin/auto-tagger;

fi;

