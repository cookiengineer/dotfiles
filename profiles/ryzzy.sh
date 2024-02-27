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
synchronize i3-desktop;
synchronize ly;

synchronize barrier-headless;
synchronize networkmanager;
synchronize openssh;
synchronize git go nodejs npm;
synchronize tor;
synchronize kitty vim;
synchronize keepassxc;

synchronize noto-fonts noto-fonts-compat noto-fonts-emoji;
synchronize librewolf gimp gparted;
synchronize ffmpeg mpv;
synchronize dnsutils macchanger net-tools nmap;
synchronize tldr yt-dlp;

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

systemctl --user enable barrier-server;

