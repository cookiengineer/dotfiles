#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";


if [ ! -x /usr/bin/auto-cleanup ]; then

	sudo cp "$DIR/auto-cleanup.sh" /usr/bin/auto-cleanup;
	sudo chmod +x /usr/bin/auto-cleanup;

fi;

