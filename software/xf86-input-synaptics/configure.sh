#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";

if [ ! -d /etc/X11/xorg.conf.d ]; then

	if [ ! -f /etc/X11/xorg.conf.d/70-synaptics.conf ]; then
		sudo cp "$DIR/70-synaptics.conf" "/etc/X11/70-synaptics.conf";
	fi;

fi;

