#!/bin/bash

BASH_RC=$(cd "$(dirname "$0")/"; pwd)"/bashrc";

if [ "$USER" == "" ]; then
	USER="cookiengineer";
fi;


cp "$BASH_RC" "/home/$USER/.bashrc";

