#!/bin/bash

if [ "$SUDO_USER" != "" ]; then
	DOT_VIM="/home/$SUDO_USER/.vim";
	VIM_RC="/home/$SUDO_USER/.vimrc";
elif [ "$USER" != "" ]; then
	DOT_VIM="/home/$USER/.vim";
	VIM_RC="/home/$USER/.vimrc";
fi;


if [ "$VIM_RC" != "" ] && [ ! -f "$VIM_RC" ]; then

	git clone "https://github.com/cookiengineer/dotvim" "$DOT_VIM";
	ln -s "$DOT_VIM/.vimrc" "$VIM_RC";

fi;

