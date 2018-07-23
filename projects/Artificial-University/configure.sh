#!/bin/bash

USER_NAME="Artificial-University";
DIR_SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";
DIR_TARGET="/home/$USER/Software/$USER_NAME";


GIT_BIN=`which git`;

if [ "$GIT_BIN" != "" ]; then

	if [ -d "$DIR_TARGET" ]; then

		cd "$DIR_TARGET";

		for repo_path in $DIR_TARGET/*/; do

			if [ -d "$repo_path/.git" ]; then

				cd $repo_path;

				repo_name=$(basename "$repo_path");
				has_github=$(git remote -v | grep ^github);

				if [ "$has_github" == "" ]; then
					git remote add github "git@github.com:$USER_NAME/$repo_name.git" 2> /dev/null;
				fi;

			fi;

		done

	fi;

fi;

