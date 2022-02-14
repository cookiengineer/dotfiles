#!/bin/bash

config="/home/$USER/.local/share/barrier";

if [[ ! -d "$config/SSL/Fingerprints" ]]; then

	mkdir -p "$config/SSL/Fingerprints";

	touch "$config/SSL/Fingerprints/Local.txt";
	touch "$config/SSL/Fingerprints/TrustedClients.txt";
	touch "$config/SSL/Fingerprints/TrustedServers.txt";

fi;

if [[ ! -f "$config/SSL/Barrier.pem" ]]; then
	openssl req -x509 -nodes -days 365 -subj /CN=Barrier -newkey rsa:4096 -keyout "$config/SSL/Barrier.pem" -out "$config/SSL/Barrier.pem";
fi;

fingerprint=$(openssl x509 -fingerprint -sha256 -noout -in "$config/SSL/Barrier.pem" | cut -d"=" -f2);

if [[ "$1" == "--as-client-for" ]] && [[ "$2" != "" ]]; then

	fingerprint_client="$fingerprint";

	echo "v2:sha256:$fingerprint_client" > "$config/SSL/Fingerprints/Local.txt";

	fingerprint_server=$(echo -n | openssl s_client -connect "$2:24800" 2> /dev/null | openssl x509 -fingerprint -sha256 -noout | cut -d"=" -f2);

	echo "v2:sha256:$fingerprint_server" > "$config/SSL/Fingerprints/TrustedServers.txt";

elif [[ "$1" == "--as-server-for" ]] && [[ "$2" != "" ]]; then

	fingerprint_server="$fingerprint";

	echo "v2:sha256:$fingerprint_server" > "$config/SSL/Fingerprints/Local.txt";

	scp "$USER@$2$config/SSL/Fingerprints/Local.txt" "$config/SSL/Fingerprints/TrustedClients.txt";

else

	echo "v2:sha256:$fingerprint" > "$config/SSL/Fingerprints/Local.txt";

fi;

