#!/bin/bash

sshd_running=$(ps -ef | grep sshd | grep cookiengineer);

if [ "$sshd_running" != "" ]; then

	echo "sshd is active.";
	exit 1;

fi;


music_running=$(ps -ef | grep python3 | grep gnome-music);

if [ "$music_running" != "" ]; then

	echo "gnome-music is active.";
	exit 1;

fi;


video_running=$(ps -ef | grep celluloid | grep gapplication-service);

if [ "$video_running" != "" ]; then

	echo "celluloid is active.";
	exit 1;

fi;


exit 0;

