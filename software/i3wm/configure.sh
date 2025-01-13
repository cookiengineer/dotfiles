#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";
UDEV_RULE="/etc/udev/rules.d/90-backlight.rules";
I3_BRIGHTNESS="/usr/bin/i3-brightness";

if [[ "${SUDO_USER}" != "" ]]; then
	ICONS_THEME="/home/${SUDO_USER}/.icons/default/index.theme";
	I3_CONFIG="/home/${SUDO_USER}/.config/i3";
elif [[ "${USER}" != "" ]]; then
	ICONS_THEME="/home/${USER}/.icons/default/index.theme";
	I3_CONFIG="/home/${USER}/.config/i3";
fi;

if [[ "${ICONS_THEME}" != "" ]] && [[ "${I3_CONFIG}" != "" ]]; then

	mkdir -p "${I3_CONFIG}";

	cp "${DIR}/config/"* "${I3_CONFIG}/";

	if [[ ! -f "${ICONS_THEME}" ]]; then

		mkdir -p $(dirname ${ICONS_THEME});
		ln -s /usr/share/icons/default/index.theme ${ICONS_THEME};

	fi;

fi;


if [[ ! -f "${UDEV_RULE}" ]]; then
	sudo cp "${DIR}/backlight.rules" "${UDEV_RULE}";
fi;


if [[ ! -f "${I3_BRIGHTNESS}" ]]; then
	sudo cp "${DIR}/i3-brightness.sh" "${I3_BRIGHTNESS}";
	sudo chmod +x "${I3_BRIGHTNESS}";
fi;

