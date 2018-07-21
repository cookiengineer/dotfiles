#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";

if [ "$SUDO_USER" != "" ]; then
	XTERM_RC="/home/$SUDO_USER/.Xresources";
elif [ "$USER" != "" ]; then
	XTERM_RC="/home/$USER/.Xresources";
fi;


if [ "$XTERM_RC" != "" ] && [ ! -f "$XTERM_RC" ]; then

	cp $DIR/.Xresources $XTERM_RC;

fi;


XRDB_BIN=`which xrdb`;

if [ "$XRDB_BIN" != "" ]; then

	$XRDB_BIN -merge $XTERM_RC;

fi;

