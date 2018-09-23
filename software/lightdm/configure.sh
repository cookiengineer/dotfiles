#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";

if [ "$SUDO_USER" != "" ]; then
	USER_NAME="$SUDO_USER";
elif [ "$USER" != "" ]; then
	USER_NAME="$USER";
fi;

GPASSWD=`which gpasswd`;

if [ "$GPASSWD" != "" ] && [ "$USER_NAME" != "" ]; then

	sudo $GPASSWD -a $USER_NAME autologin;

fi;

SYS_CTL=`which systemctl`;

if [ "$SYS_CTL" != "" ]; then

	sudo $SYS_CTL enable lightdm.service;

fi;


if [ -d /etc/lightdm ]; then

	sudo cp "$DIR/lightdm.conf" /etc/lightdm/lightdm.conf;

	if [ "$USER_NAME" != "cookiengineer" ]; then
		sudo sed -i 's|cookiengineer|'$USER_NAME'|g' /etc/lightdm/lightdm.conf;
	fi;

fi;

