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
synchronize git;
synchronize openssh;
synchronize nodejs;
synchronize tor;
synchronize kitty;
synchronize vim;

synchronize noto-fonts noto-fonts-compat noto-fonts-emoji;
synchronize chromium firefox;
synchronize gimp gparted transmission-gtk uget;
synchronize ffmpeg celluloid lollypop;
synchronize dnsutils macchanger net-tools nmap;

#
# XXX: AUR software
#

synchronize tldr youtube-dl mobac openscad;

synchronize auto-tagger;
synchronize chromium-extensions;
synchronize pacman-backup;

#
# XXX: GIT projects
#

clone cookiengineer "*";
clone tholian-network "*";

#
# XXX: System config
#

sudo chmod +r /etc/NetworkManager/system-connections;
sudo cp "$PROFILE_ROOT/etc/NetworkManager/system-connections/Workshop.nmconnection" "/etc/NetworkManager/system-connections/Workshop.nmconnection";
sudo cp "$PROFILE_ROOT/etc/barrier.conf" "/etc/barrier.conf";
cp "$PROFILE_ROOT/home/cookiengineer/.config/i3status/config" "/home/$USER/.config/i3status/config";

systemctl --user enable barrier-server;

barrier_profile="/home/$USER/.local/share/barrier";
ping_tinky=$(ping -c 1 tinky 1> /dev/null 2> /dev/null; echo $?);

if [[ ! -f "$barrier_profile/SSL/Fingerprints/TrustedClients.txt" ]]; then
	touch "$barrier_profile/SSL/Fingerprints/TrustedClients.txt";
fi;

if [[ "$ping_tinky" == "0" ]]; then
	fingerprint=$(ssh cookiengineer@tinky "cat $barrier_profile/SSL/Fingerprints/Local.txt");
	echo "$fingerprint" >> "$barrier_profile/SSL/Fingerprints/TrustedClients.txt";
fi;

