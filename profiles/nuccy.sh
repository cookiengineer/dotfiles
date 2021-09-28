#!/bin/bash


if [ "$1" == "--debug" ]; then
	source "$(dirname "$0")/_lib/archlinux.sh" "nuccy" "--debug";
else
	source "$(dirname "$0")/_lib/archlinux.sh" "nuccy";
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
synchronize bluez bluez-firmware bluez-libs bluez-utils;
synchronize chromium firefox gimp gparted transmission-gtk uget;
synchronize ffmpeg celluloid lollypop;
synchronize dnsutils macchanger net-tools nmap;

#
# XXX: AUR software
#

synchronize wireless-regdb-pentest;
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

monitor_conf="/etc/X11/xorg.conf.d/10-monitor.conf";
if [[ ! -f "$monitor_conf" ]]; then
	sudo cp "$PROFILE_ROOT$monitor_conf" $monitor_conf;
fi;

systemctl --user enable barrier-server;

