#!/bin/bash

if [ "$EMAIL" == "" ]; then

	if [ "$SUDO_USER" != "" ]; then
		EMAIL="$SUDO_USER@protonmail.com";
	elif [ "$USER" != "" ]; then
		EMAIL="$USER@protonmail.com";
	fi;

fi;

git config --global user.name "Cookie Engineer";

if [ "$EMAIL" != "" ]; then
	git config --global user.email "$EMAIL";
fi;

git config --global user.signingkey "5D60A3B7272A6C2C9B55B4A8340F6A4848C5F849";
git config --global commit.gpgsign true;
git config --global diff.tool vimdiff;
git config --global difftool.prompt false;
git config --global alias.d difftool;

