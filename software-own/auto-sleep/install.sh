#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";


if [ ! -x /usr/bin/auto-cleanup ]; then

	sudo cp "$DIR/auto-sleep.sh" /usr/bin/auto-sleep;
	sudo chmod +x /usr/bin/auto-sleep;

fi;


if [ ! -x /usr/lib/systemd/system/auto-sleep.service ]; then

	sudo cp "$DIR/auto-sleep.service" /usr/lib/systemd/system/auto-sleep.service;

fi;

