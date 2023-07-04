#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";

if [[ "$SUDO_USER" != "" ]]; then
	ICONS_THEME="/home/$USER/.icons/default/index.theme";
	I3_CONFIG="/home/$SUDO_USER/.config/i3";
	I3STATUS_CONFIG="/home/$SUDO_USER/.config/i3status";
elif [[ "$USER" != "" ]]; then
	ICONS_THEME="/home/$USER/.icons/default/index.theme";
	I3_CONFIG="/home/$USER/.config/i3";
	I3STATUS_CONFIG="/home/$USER/.config/i3status";
fi;

if [[ "$ICONS_THEME" != "" ]] && [[ "$I3_CONFIG" != "" ]] && [[ "$I3STATUS_CONFIG" != "" ]]; then

	mkdir -p "$I3_CONFIG";
	mkdir -p "$I3STATUS_CONFIG";

	cp $DIR/i3/* "$I3_CONFIG/";
	cp $DIR/i3status/* "$I3STATUS_CONFIG/";

	if [[ "$HOSTNAME" != "" ]] && [[ -f "$I3STATUS_CONFIG/config.$HOSTNAME" ]]; then
		mv "$I3STATUS_CONFIG/config.$HOSTNAME" "$I3STATUS_CONFIG/config";
	fi;

	if [[ ! -f "$ICONS_THEME" ]]; then

		mkdir -p $(dirname $ICONS_THEME);
		ln -s /usr/share/icons/default/index.theme $ICONS_THEME;

	fi;

fi;

UDEV_RULE="/etc/udev/rules.d/90-backlight.rules";

if [[ ! -f "$UDEV_RULE" ]]; then
	sudo cp "$DIR/backlight.rules" "$UDEV_RULE";
fi;

I3_BRIGHTNESS="/usr/bin/i3-brightness";

if [[ ! -f "$I3_BRIGHTNESS" ]]; then
	sudo cp $DIR/i3-brightness.sh "$I3_BRIGHTNESS";
	sudo chmod +x "$I3_BRIGHTNESS";
fi;

I3STATUS_FONT="/usr/share/fonts/TTF/i3status.ttf";

if [[ ! -f "$I3STATUS_FONT" ]]; then
	sudo cp $DIR/i3status-font/i3status.ttf /usr/share/fonts/TTF/i3status.ttf;
	fc-cache -f -v;
fi;

