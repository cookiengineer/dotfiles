#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";

if [ "$SUDO_USER" != "" ]; then
	NEMO_ACTIONS="/home/$SUDO_USER/.local/share/nemo/actions";
	KITTY_RC="/home/$SUDO_USER/.config/kitty/kitty.conf";
elif [ "$USER" != "" ]; then
	NEMO_ACTIONS="/home/$USER/.local/share/nemo/actions";
	KITTY_RC="/home/$USER/.config/kitty/kitty.conf";
fi;


if [ "$KITTY_RC" != "" ] && [ ! -f "$KITTY_RC" ]; then

	mkdir -p $(dirname $KITTY_RC);

	cp $DIR/kitty.conf $KITTY_RC;

fi;


if [ "$NEMO_ACTIONS" != "" ]; then

	if [ ! -d "$NEMO_ACTIONS" ]; then
		mkdir -p "$NEMO_ACTIONS";
	fi;

	if [ ! -f "$NEMO_ACTIONS/open-in-kitty.nemo_action" ]; then
		cp "$DIR/open-in-kitty.nemo_action" "$NEMO_ACTIONS/open-in-kitty.nemo_action";
	fi;

fi;

