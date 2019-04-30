#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";

if [ "$SUDO_USER" != "" ]; then
	USER_NAME="$SUDO_USER";
elif [ "$USER" != "" ]; then
	USER_NAME="$USER";
fi;

SYS_CTL=`which systemctl`;

if [ "$SYS_CTL" != "" ]; then

	sudo $SYS_CTL enable gdm.service;

fi;


if [ -d /etc/gdm ]; then

	sudo cp "$DIR/custom.conf" /etc/gdm/custom.conf;

	if [ "$USER_NAME" != "cookiengineer" ]; then
		sudo sed -i 's|cookiengineer|'$USER_NAME'|g' /etc/gdm/custom.conf;
	fi;

fi;

