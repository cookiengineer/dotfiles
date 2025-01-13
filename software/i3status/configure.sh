#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";
I3STATUS_FONT="/usr/share/fonts/TTF/i3status.ttf";

if [[ "${SUDO_USER}" != "" ]]; then
	I3STATUS_CONFIG="/home/${SUDO_USER}/.config/i3status";
elif [[ "${USER}" != "" ]]; then
	I3STATUS_CONFIG="/home/${USER}/.config/i3status";
fi;

if [[ "${I3STATUS_CONFIG}" != "" ]]; then

	mkdir -p "${I3STATUS_CONFIG}";

	if [[ "${HOSTNAME}" != "" ]] && [[ -f "${DIR}/config.${HOSTNAME}" ]]; then
		cp "${DIR}/config.${HOSTNAME}" "${I3STATUS_CONFIG}/config";
	else
		cp "${DIR}/config" "${I3STATUS_CONFIG}/config";
	fi;

fi;

if [[ ! -f "${I3STATUS_FONT}" ]]; then
	sudo cp "${DIR}/font/i3status.ttf" "${I3STATUS_FONT}";
	fc-cache -f -v;
fi;

