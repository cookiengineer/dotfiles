#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";
BARRIER_RC="/etc/barrier.conf";
BARRIER_CLIENT_SERVICE="/etc/systemd/user/barrier-client.service";
BARRIER_SERVER_SERVICE="/etc/systemd/user/barrier-server.service";


if [ ! -f "$BARRIER_RC" ]; then

	sudo cp $DIR/barrier.conf $BARRIER_RC;

fi;

if [ ! -f "$BARRIER_CLIENT_SERVICE" ]; then

	sudo cp $DIR/barrier-client.service $BARRIER_CLIENT_SERVICE;

fi;

if [ ! -f "$BARRIER_SERVER_SERVICE" ]; then

	sudo cp $DIR/barrier-server.service $BARRIER_SERVER_SERVICE;

fi;

