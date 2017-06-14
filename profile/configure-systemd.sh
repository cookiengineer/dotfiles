#!/bin/bash

SYSTEMD_FILES=$(cd "$(dirname "$0")/"; pwd)"/_etc/systemd/system";


GIT_COCKPIT=`which git-cockpit`;

if [ "$GIT_COCKPIT" != "" ]; then

	sudo cp "$SYSTEMD_FILES/git-cockpit.service" "/etc/systemd/system/git-cockpit.service";
	sudo systemctl enable git-cockpit;
	sudo systemctl start git-cockpit;

fi;

