#!/bin/bash

if [ "$EMAIL" == "" ]; then

	if [ "$SUDO_USER" != "" ]; then
		EMAIL="$SUDO_USER@protonmail.ch";
	elif [ "$USER" != "" ]; then
		EMAIL="$USER@protonmail.ch";
	fi;

fi;

git config --global user.name "Cookie Engineer";

if [ "$EMAIL" != "" ]; then
	git config --global user.email "$EMAIL";
fi;

git config --global user.signingkey "61F3D706EDE7DDB6C9E41784A78F070057B04FD7";
git config --global commit.gpgsign true;
git config --global diff.tool vimdiff;
git config --global difftool.prompt false;
git config --global alias.d difftool;

