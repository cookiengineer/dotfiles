#!/bin/bash

if [ "$USER" == "" ]; then
	USER="cookiengineer";
fi;

if [ "$EMAIL" == "" ]; then
	EMAIL="$USER@protonmail.ch";
fi;



if [ ! -f "/home/$USER/.ssh/id_rsa" ]; then
	ssh-keygen -t rsa -b 8192 -C "$EMAIL";
fi;

SSH_PUBLIC_KEY=$(cat "/home/$USER/.ssh/id_rsa.pub");

