#!/bin/bash

if [ "$EMAIL" == "" ]; then

	if [ "$SUDO_USER" != "" ]; then
		EMAIL="$SUDO_USER@protonmail.ch";
	elif [ "$USER" != "" ]; then
		EMAIL="$USER@protonmail.ch";
	fi;

fi;

if [ "$SUDO_USER" != "" ]; then
	ID_RSA="/home/$SUDO_USER/.ssh/id_rsa";
elif [ "$USER" != "" ]; then
	ID_RSA="/home/$USER/.ssh/id_rsa";
fi;


if [ "$ID_RSA" != "" ] && [ ! -f "$ID_RSA" ]; then

	ssh-keygen -t rsa -b 8192 -C "$EMAIL";

fi;


SSHD_BIN=`which sshd`;
SYS_CTL=`which systemctl`;

if [ "$SSHD_BIN" != "" ] && [ "$SYS_CTL" != "" ]; then

	sudo $SYS_CTL enable sshd.service;

fi;

