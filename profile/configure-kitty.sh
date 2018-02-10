#!/bin/bash

KITTY_CONF=$(cd "$(dirname "$0")/"; pwd)"/_etc/kitty.conf";

if [ "$USER" == "" ]; then
	USER="cookiengineer";
fi;


mkdir -p "/home/$USER/.config/kitty";
cp "$KITTY_CONF" "/home/$USER/.config/kitty/kitty.conf";

