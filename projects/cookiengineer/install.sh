#!/bin/bash

USER_NAME="cookiengineer";
DIR_SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";
DIR_TARGET="/home/$USER/Software/$USER_NAME";


GIT_BIN=`which git`;

if [ "$GIT_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm git;
	GIT_BIN=`which git`;

fi;


NODEJS_BIN=`which node`;

if [ "$NODEJS_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm nodejs;
	NODEJS_BIN=`which node`;

fi;


if [ "$GIT_BIN" != "" ] && [ "$NODEJS_BIN" != "" ]; then

	if [ ! -d "$DIR_TARGET" ]; then
		mkdir -p "$DIR_TARGET";
	fi;


	$NODEJS_BIN $DIR_SOURCE/../_lib/update-github.js $USER_NAME;


	while IFS= read -r line; do

		if [ "$line" != "" ]; then

			repo_url="$line";
			repo_name=$(basename "$line");
			repo_name=${repo_name%.git};


			if [ ! -d "$DIR_TARGET/$repo_name" ]; then

				mkdir -p "$DIR_TARGET/$repo_name";

				cd "$DIR_TARGET/$repo_name";
				git clone "$repo_url" "$DIR_TARGET/$repo_name";

			elif [ -d "$DIR_TARGET/$repo_name/.git" ]; then

				cd "$DIR_TARGET/$repo_name";
				git fetch --all;

			fi;

		fi;

	done < "$DIR_SOURCE/repos.txt";

fi;

