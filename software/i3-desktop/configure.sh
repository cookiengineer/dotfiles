#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";

if [[ "$SUDO_USER" != "" ]]; then
	ICONS_THEME="/home/$USER/.icons/default/index.theme";
	I3_CONFIG="/home/$SUDO_USER/.config/i3/config";
	I3STATUS_CONFIG="/home/$SUDO_USER/.config/i3status/config";
elif [[ "$USER" != "" ]]; then
	ICONS_THEME="/home/$USER/.icons/default/index.theme";
	I3_CONFIG="/home/$USER/.config/i3/config";
	I3STATUS_CONFIG="/home/$USER/.config/i3status/config";
fi;

if [[ "$ICONS_THEME" != "" ]] && [[ "$I3_CONFIG" != "" ]] && [[ "$I3STATUS_CONFIG" != "" ]]; then

	mkdir -p $(dirname $I3_CONFIG);
	mkdir -p $(dirname $I3STATUS_CONFIG);

	cp $DIR/i3_config "$I3_CONFIG";
	cp $DIR/i3status_config "$I3STATUS_CONFIG";

	if [[ ! -f "$ICONS_THEME" ]]; then

		mkdir -p $(dirname $ICONS_THEME);
		ln -s /usr/share/icons/default/index.theme $ICONS_THEME;

	fi;

fi;

I3_BRIGHTNESS="/usr/bin/i3-brightness";

if [[ ! -f "$I3_BRIGHTNESS" ]]; then
	sudo cp $DIR/i3-brightness.sh /usr/bin/i3-brightness;
	sudo chmod +x /usr/bin/i3-brightness;
fi;

