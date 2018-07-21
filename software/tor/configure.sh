#!/bin/bash

TOR_RC="/etc/tor/torrc";
HAS_IPV6=$(cat $TOR_RC 2> /dev/null | grep ClientUseIPv6);

if [ "$HAS_IPV6" == "" ]; then

	sudo echo -e "\n\n" >> $TOR_RC;
	sudo echo -e "ClientUseIPv6 1\n" >> $TOR_RC;
	sudo echo -e "ClientPreferIPv6ORPort 1\n" >> $TOR_RC;

fi;


SYS_CTL=`which systemctl`;

if [ "$SYS_CTL" != "" ]; then
	sudo $SYS_CTL enable tor.service;
fi;

