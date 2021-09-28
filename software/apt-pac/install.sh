#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";


if [ ! -x /usr/bin/apt-pac ]; then

	sudo cp "$DIR/apt-pac.sh" /usr/bin/apt-pac;
	sudo chmod +x /usr/bin/apt-pac;

fi;

