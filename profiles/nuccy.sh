#!/bin/bash


if [ "$1" == "--debug" ]; then
	source "$(dirname "$0")/_lib/archlinux.sh" "nuccy" "--debug";
	source "$(dirname "$0")/../projects/github.sh" "--debug";
else
	source "$(dirname "$0")/_lib/archlinux.sh" "nuccy";
	source "$(dirname "$0")/../projects/github.sh";
fi;


#
# XXX: MAIN software
#

synchronize filesystem bash base base-devel;
synchronize trizen;
synchronize i3wm;
synchronize polybar;
synchronize ly;

synchronize barrier-headless;
synchronize networkmanager;
synchronize openssh;
synchronize git go nodejs npm;
synchronize tor;
synchronize kitty vim;

synchronize noto-fonts noto-fonts-compat noto-fonts-emoji;
synchronize firefox gimp gparted;
synchronize ffmpeg mpv;
synchronize dnsutils macchanger net-tools nmap;
synchronize openscad tldr yt-dlp;

#
# XXX: AUR software
#

synchronize wireless-regdb-pentest;
syncrhonize mobac;

synchronize auto-tagger;
synchronize chromium-extensions;
synchronize pacman-backup;

#
# XXX: GIT projects
#

confirm_github;

if [ "$?" == "0" ]; then
	clone_github;
fi;

#
# XXX: System config
#

sudo chmod +r /etc/NetworkManager/system-connections;
sudo cp "$PROFILE_ROOT/etc/hosts" "/etc/hosts";
sudo cp "$PROFILE_ROOT/etc/NetworkManager/system-connections/Home.nmconnection" "/etc/NetworkManager/system-connections/Home.nmconnection";
cp "$PROFILE_ROOT/home/cookiengineer/.config/i3status/config" "/home/$USER/.config/i3status/config";


keyboard_conf="/etc/X11/xorg.conf.d/00-keyboard.conf";
if [[ ! -f "$keyboard_conf" ]]; then
	sudo cp "$PROFILE_ROOT$keyboard_conf" $keyboard_conf;
fi;

monitor_conf="/etc/X11/xorg.conf.d/10-monitor.conf";
if [[ ! -f "$monitor_conf" ]]; then
	sudo cp "$PROFILE_ROOT$monitor_conf" $monitor_conf;
fi;

intel_conf="/etc/X11/xorg.conf.d/20-intel.conf";
if [[ ! -f "$intel_conf" ]]; then
	sudo cp "$PROFILE_ROOT$intel_conf" $intel_conf;
fi;


systemctl --user enable barrier-client;

