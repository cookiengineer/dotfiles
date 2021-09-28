#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";


if [[ "$(which node 2>/dev/null)" == "" ]]; then
	sudo pacman -S --needed --noconfirm nodejs;
fi;


if [ ! -x /usr/bin/pacman-server ]; then

	sudo cp "$DIR/pacman-server.js" /usr/bin/pacman-server;
	sudo chmod +x /usr/bin/pacman-server;

fi;

