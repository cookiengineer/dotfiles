#!/bin/bash

OPENSNITCH_UI_BIN=`which opensnitch-ui`;

if [ "$OPENSNITCH_UI_BIN" == "" ]; then

	trizen -S --needed --noconfirm opensnitch;
	trizen -S --needed --noconfirm python-pyasn python-qt-material;

fi;

