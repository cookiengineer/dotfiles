#!/bin/bash


if [ "$1" == "--debug" ]; then
	source "$(dirname "$0")/.include/archlinux.sh" "weep" "--debug";
else
	source "$(dirname "$0")/.include/archlinux.sh" "weep";
fi;


#
# XXX: MAIN software
#

synchronize filesystem bash base-devel;
synchronize trizen;
synchronize i3-desktop;
synchronize ly;

synchronize barrier-headless;
synchronize networkmanager;
synchronize modemmanager;
synchronize git;
synchronize openssh;
synchronize nodejs;
synchronize tor;
synchronize kitty;
synchronize vim;
synchronize keepassxc;

synchronize bluez bluez-firmware bluez-libs bluez-utils;
synchronize noto-fonts noto-fonts-compat noto-fonts-emoji;
synchronize chromium firefox gimp gparted transmission-gtk uget;
synchronize ffmpeg celluloid lollypop;
synchronize dnsutils macchanger net-tools nmap;
synchronize telegram-desktop;
synchronize teams;

#
# XXX: AUR software
#

synchronize wireless-regdb-pentest;
synchronize tldr youtube-dl;

synchronize auto-tagger;
synchronize chromium-extensions;
synchronize pacman-backup;

#
# XXX: System config
#

sudo chmod +r /etc/NetworkManager/system-connections;
sudo cp "$PROFILE_ROOT/etc/NetworkManager/system-connections/Workshop.nmconnection" "/etc/NetworkManager/system-connections/Workshop.nmconnection";
cp "$PROFILE_ROOT/home/cookiengineer/.config/i3status/config" "/home/$USER/.config/i3status/config";

systemctl --user enable barrier-server;

barrier_profile="/home/$USER/.local/share/barrier";
ping_weep=$(ping -c 1 weep 1> /dev/null 2> /dev/null; echo $?);

if [[ ! -f "$barrier_profile/SSL/Fingerprints/TrustedServers.txt" ]]; then
	touch "$barrier_profile/SSL/Fingerprints/TrustedServers.txt";
fi;

if [[ "$ping_weep" == "0" ]]; then
	fingerprint=$(echo -n | openssl s_client -connect "weep:24800" 2> /dev/null | openssl x509 -fingerprint -sha256 -noout | cut -d"=" -f2);
	echo "v2:sha256:$fingerprint" >> "$barrier_profile/SSL/Fingerprints/TrustedServers.txt";
fi;

