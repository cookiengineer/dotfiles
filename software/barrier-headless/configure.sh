#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";
BARRIER_RC="/etc/barrier.conf";
BARRIER_CLIENT_SERVICE="/etc/systemd/user/barrier-client.service";
BARRIER_SERVER_SERVICE="/etc/systemd/user/barrier-server.service";
PROFILE="/home/$USER/.local/share/barrier";
SSH="$(which ssh 2> /dev/null)";


if [[ ! -f "$BARRIER_RC" ]]; then
	sudo cp $DIR/barrier.conf $BARRIER_RC;
fi;

if [[ ! -d "$PROFILE/SSL/Fingerprints" ]]; then
	mkdir -p "$PROFILE/SSL/Fingerprints";
fi;

if [[ ! -f "$PROFILE/SSL/Barrier.pem" ]]; then
	openssl req -x509 -nodes -days 365 -subj /CN=Barrier -newkey rsa:4096 -keyout "$PROFILE/SSL/Barrier.pem" -out "$PROFILE/SSL/Barrier.pem";
fi;

if [[ ! -f "${PROFILE}/SSL/Fingerprints/Local.txt" ]]; then
	fingerprint=$(openssl x509 -fingerprint -sha256 -noout -in "${PROFILE}/SSL/Barrier.pem" | cut -d"=" -f2);
	echo "v2:sha256:${fingerprint}" > "${PROFILE}/SSL/Fingerprints/Local.txt";
fi;



if [[ "$HOSTNAME" == "ryzzy" ]]; then

	if [[ ! -f "${BARRIER_SERVER_SERVICE}" ]]; then
		sudo cp "${DIR}/barrier-server.service" "${BARRIER_SERVER_SERVICE}";
	fi;

elif [[ "$HOSTNAME" == "tinky" ]] || [[ "$HOSTNAME" == "nuccy" ]]; then

	if [[ ! -f "${BARRIER_CLIENT_SERVICE}" ]]; then
		sudo cp "${DIR}/barrier-client.service" "${BARRIER_CLIENT_SERVICE}";
	fi;

	fingerprint_local=$(cat "${PROFILE}/SSL/Fingerprints/Local.txt");

	if [[ "${fingerprint_local}" != "" ]]; then

		check_local=$(${SSH} "$USER@ryzzy" -p 22 "cat ${PROFILE}/SSL/Fingerprints/TrustedClients.txt | grep \"${fingerprint_local}\"");

		if [[ "${check_local}" == "" ]]; then
			${SSH} "$USER@ryzzy" -p 22 "echo \"${fingerprint_local}\" >> ${PROFILE}/SSL/Fingerprints/TrustedClients.txt";
		fi;

	fi;

	fingerprint_remote=$(${SSH} "$USER@ryzzy" -p 22 "cat ${PROFILE}/SSL/Fingerprints/Local.txt");

	if [[ "${fingerprint_remote}" != "" ]]; then

		check_remote=$(cat ${PROFILE}/SSL/Fingerprints/TrustedServers.txt | grep "${fingerprint_remote}");

		if [[ "${check_remote}" == "" ]]; then
			echo "${fingerprint_remote}" >> ${PROFILE}/SSL/Fingerprints/TrustedServers.txt;
		fi;

	fi;

fi

