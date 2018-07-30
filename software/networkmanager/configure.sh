#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";


SYS_CTL=`which systemctl`;

if [ "$SYS_CTL" != "" ]; then

	sudo $SYS_CTL enable NetworkManager.service;

fi;


if [ -d /etc/NetworkManager/conf.d ]; then

	if [ ! -f /etc/NetworkManager/conf.d/30-mac-randomization.conf ]; then
		sudo cp "$DIR/30-mac-randomization.conf" /etc/NetworkManager/conf.d/30-mac-randomization.conf;
	fi;

fi;

