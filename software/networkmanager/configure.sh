#!/bin/bash

SYS_CTL=`which systemctl`;

if [ "$SYS_CTL" != "" ]; then

	sudo $SYS_CTL enable NetworkManager.service;

fi;

