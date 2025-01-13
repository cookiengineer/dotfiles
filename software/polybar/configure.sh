#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";

if [[ "${SUDO_USER}" != "" ]]; then
	POLYBAR_CONFIG="/home/${SUDO_USER}/.config/polybar";
elif [[ "$USER" != "" ]]; then
	POLYBAR_CONFIG="/home/${USER}/.config/polybar";
fi;

if [[ "${POLYBAR_CONFIG}" != "" ]]; then

	mkdir -p "${POLYBAR_CONFIG}";

	if [[ "${HOSTNAME}" != "" ]] && [[ -f "${DIR}/config.${HOSTNAME}" ]]; then
		cp "${DIR}/config.${HOSTNAME}" "${POLYBAR_CONFIG}/config.ini";
	else
		cp "${DIR}/config.ini" "${POLYBAR_CONFIG}/config.ini";
	fi;

fi;

