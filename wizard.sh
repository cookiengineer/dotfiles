#!/bin/bash

source "$(dirname "$0")/profiles/.include/archlinux.sh" "wizard" "--debug";

if [ "$1" == "synchronize" ]; then

	synchronize "$2";
	exit $?;

elif [ "$1" == "clone" ]; then

	clone "$2" "$3";
	exit $?;

else

	echo "This wizard can only \"synchronize\" and \"clone\" for now.";
	exit 1;

fi;

