#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";

if [ "$SUDO_USER" != "" ]; then
	BASH_RC="/home/$SUDO_USER/.bashrc";
elif [ "$USER" != "" ]; then
	BASH_RC="/home/$USER/.bashrc";
fi;


if [ "$BASH_RC" != "" ] && [ ! -f "$BASH_RC" ]; then

	cp $DIR/.bashrc $BASH_RC;

elif [ -f "$BASH_RC" ]; then

	check_bashrc=$(cat $BASH_RC | grep "XXX: COOKIENGINEERS BASHRC");

	if [ "$check_bashrc" == "" ]; then

		cp $DIR/.bashrc $BASH_RC;

	fi;

fi;

