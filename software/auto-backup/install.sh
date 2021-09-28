#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";


if [[ "$(which git 2>/dev/null)" == "" ]]; then
	sudo pacman -S --needed --noconfirm git;
fi;

if [[ "$(which node 2>/dev/null)" == "" ]]; then
	sudo pacman -S --needed --noconfirm nodejs;
fi;

if [[ "$(which secret-tool 2>/dev/null)" == "" ]]; then
	sudo pacman -S --needed --noconfirm libsecret;
fi;

if [[ "$(which sqlite3 2>/dev/null)" == "" ]]; then
	sudo pacman -S --needed --noconfirm sqlite;
fi;


if [ ! -x /usr/lib/auto-backup ]; then

	sudo mkdir -p /usr/lib/auto-backup;
	sudo cp -R $DIR/auto-backup/* /usr/lib/auto-backup/;

fi;


if [ ! -x /usr/bin/auto-backup ]; then

	sudo ln -s /usr/lib/auto-backup/index.mjs /usr/bin/auto-backup;
	sudo chmod +x /usr/bin/auto-backup;

fi;

