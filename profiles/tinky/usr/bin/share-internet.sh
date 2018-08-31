#!/bin/bash

USER_WHO=`whoami`;

if [ "$USER_WHO" != "root" ]; then

	echo "Please use \"sudo $0\".";

else

	modprobe iptable_nat;
	echo 1 > /proc/sys/net/ipv4/ip_forward;

	local wifi_iface="";
	local eth_iface="";

	local ifconfig=`which ifconfig`;

	if [ "$ifconfig" != "" ]; then

		eth_iface=`$ifconfig -s | grep enp | head -n 1 | cut -d" " -f1`;
		wifi_iface=`$ifconfig -s | grep wlp0 | head -n 1 | cut -d" " -f1`;

		if [ "$wifi_iface" != "" ]; then
			echo "Could not detect USB wifi ...";
			wifi_iface=`$ifconfig -s | grep wlp | head -n 1 | cut -d" " -f1`;
		fi;

	fi;


	if [ "$wifi_iface" != "" ] && [ "$eth_iface" != "" ]; then

		echo "Setting IP tables ...";
		echo "Wi-Fi (internet) is $wifi_iface";
		echo "Ether (intranet) is $eth_iface";

		iptables -t nat -A POSTROUTING -o $wifi_iface -j MASQUERADE;
		iptables -A FORWARD -i $eth_iface -j ACCEPT;

	else

		echo "Could not detect network interfaces.";
		echo "Are they up and running?";

		exit 1;

	fi;


fi;
