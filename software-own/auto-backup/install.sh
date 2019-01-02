#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";


GIT_BIN=`which git`;

if [ "$GIT_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm git;

fi;


NODEJS_BIN=`which node`;

if [ "$NODEJS_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm nodejs;

fi;


# if [ ! -x /usr/bin/auto-backup ]; then

	cat "$DIR/console.js" "$DIR/auto-backup.js" > /tmp/auto-backup.js;
	sudo mv /tmp/auto-backup.js /usr/bin/auto-backup;
	sudo chmod +x /usr/bin/auto-backup;

# fi;

