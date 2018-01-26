#!/bin/bash

if [ "$USER" == "" ]; then
	USER="cookiengineer";
fi;


git config --global user.name "Cookie Engineer";
git config --global diff.tool vimdiff;
git config --global difftool.prompt false;
git config --global alias.d difftool;

