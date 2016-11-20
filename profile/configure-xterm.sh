#!/bin/bash

XTERM_RC=$(cd "$(dirname "$0")/"; pwd)"/Xresources";
XRDB=`which xrdb`;

if [ "$USER" == "" ]; then
	USER="cookiengineer";
fi;


cp "$XTERM_RC" "/home/$USER/.Xresources";

if [ -x "$XRDB" ]; then

	$XRDB -merge "/home/$USER/.Xresources";

fi;

