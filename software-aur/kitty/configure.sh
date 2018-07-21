#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";

if [ "$SUDO_USER" != "" ]; then
	KITTY_RC="/home/$SUDO_USER/.config/kitty/kitty.conf";
elif [ "$USER" != "" ]; then
	KITTY_RC="/home/$USER/.config/kitty/kitty.conf";
fi;

if [ "$KITTY_RC" != "" ] && [ ! -f "$KITTY_RC" ]; then

	mkdir -p $(dirname $KITTY_RC);

	cp $DIR/kitty.conf $KITTY_RC;

fi;

