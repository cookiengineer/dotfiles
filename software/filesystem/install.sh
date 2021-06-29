#!/bin/bash

if [ ! -f /etc/hosts ]; then

	sudo pacman -S --needed --noconfirm filesystem;

fi;

