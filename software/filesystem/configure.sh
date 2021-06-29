#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";
HAS_HOSTS=$(cat /etc/hosts 2> /dev/null | grep "192.168.");


if [ "$HAS_HOSTS" == "" ]; then
	sudo cp "$DIR/hosts" /etc/hosts;
fi;

