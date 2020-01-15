#!/bin/bash

if [ "$SUDO_USER" != "" ]; then
	VIM_RC="/home/$SUDO_USER/.vimrc";
elif [ "$USER" != "" ]; then
	VIM_RC="/home/$USER/.vimrc";
fi;


if [ "$VIM_RC" != "" ] && [ ! -f "$VIM_RC" ]; then

	cd "/home/$USER";

	git clone https://github.com/cookiengineer/dotvim .vim;
	ln -s .vim/.vimrc .vimrc;

fi;

