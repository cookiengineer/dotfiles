#!/bin/bash

if [ "$USER" == "" ]; then
	USER="cookiengineer";
fi;


git config --global user.name "Cookie Engineer";
git config --global user.signingkey "61F3D706EDE7DDB6C9E41784A78F070057B04FD7";
git config --global commit.gpgsign true;
git config --global diff.tool vimdiff;
git config --global difftool.prompt false;
git config --global alias.d difftool;

