#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";

if [ ! -x /usr/bin/pacman-server ]; then

	sudo cp "$DIR/pacman-server.js" /usr/bin/pacman-server;
	sudo chmod +x /usr/bin/pacman-server;

fi;

