#!/bin/bash

ROOT=$(cd "$(dirname "$0")/"; pwd);
err=0;


if [ "$USER" == "" ]; then
	echo "USER is not set.";
	err=1;
fi;

if [ "$EMAIL" == "" ]; then
	echo "EMAIL is not set.";
	err=1;
fi;

if [ -f "$ROOT/profile/$1/install.sh" ]; then
	PROFILE="$ROOT/profile/$1";
else
	echo "Profile '$1' does not exist.";
	err=1;
fi;


if [ "$err" == "0" ]; then

	if [ -f "$PROFILE/install.sh" ]; then
		chmod +x "$PROFILE/install.sh";
		sudo $PROFILE/install.sh;
	fi;


	if [ -f "$PROFILE/configure.sh" ]; then
		chmod +x "$PROFILE/configure.sh";
		$PROFILE/configure.sh;
	fi;

	chmod +x "$ROOT/profile/configure-ssh.sh";
	$ROOT/profile/configure-ssh.sh;

	chmod +x "$ROOT/profile/configure-bash.sh";
	$ROOT/profile/configure-bash.sh;

	chmod +x "$ROOT/profile/configure-top.sh";
	$ROOT/profile/configure-top.sh;

else
	exit 1;
fi;

