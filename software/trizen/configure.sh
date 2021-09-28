#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";

if [ "$SUDO_USER" != "" ]; then
	TRIZEN_CONF="/home/$SUDO_USER/.config/trizen/trizen.conf";
elif [ "$USER" != "" ]; then
	TRIZEN_CONF="/home/$USER/.config/trizen/trizen.conf";
fi;


if [ "$TRIZEN_CONF" != "" ] && [ ! -f "$TRIZEN_CONF" ]; then

	mkdir -p $(dirname $TRIZEN_CONF);

	cp $DIR/trizen.conf $TRIZEN_CONF;

fi;

