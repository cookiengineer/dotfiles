#!/bin/bash

source "$(dirname "$0")/profiles/_lib/install.sh" "wizard" "--debug";

if [ "$1" == "install" ]; then

	if [ "$2" == "software" ]; then

		_install software "$3";
		exit $?;

	elif [ "$2" == "software-aur" ]; then

		_install software-aur "$3";
		exit $?;

	elif [ "$2" == "software-own" ]; then

		_install software-own "$3";
		exit $?;

	else

		echo "This wizard can only install \"software\", \"software-aur\" and \"software-own\" for now.";
		exit 1;

	fi;

else

	echo "This wizard can only \"install\" for now.";
	exit 1;

fi;

