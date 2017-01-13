#!/bin/bash

BASH_RC=$(cd "$(dirname "$0")/"; pwd)"/_etc/bashrc";
Z_SH=$(cd "$(dirname "$0")/"; pwd)"/_etc/profile.d/z.sh";

if [ "$USER" == "" ]; then
	USER="cookiengineer";
fi;


sudo cp "$Z_SH" "/etc/profile.d/z.sh";
cp "$BASH_RC" "/home/$USER/.bashrc";

