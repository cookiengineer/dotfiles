#!/bin/bash

TOP_RC=$(cd "$(dirname "$0")/"; pwd)"/toprc";

if [ "$USER" == "" ]; then
	USER="cookiengineer";
fi;


cp "$TOP_RC" "/home/$USER/.toprc";

