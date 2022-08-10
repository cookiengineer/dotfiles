#!/bin/bash


OPENSNITCHD_BIN=`which opensnitchd`;
SYS_CTL=`which systemctl`;

if [ "$OPENSNITCHD_BIN" != "" ] && [ "$SYS_CTL" != "" ]; then

	sudo $SYS_CTL enable opensnitchd.service;

fi;

