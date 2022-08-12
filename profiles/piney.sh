#!/bin/bash


if [ "$1" == "--debug" ]; then
	source "$(dirname "$0")/_lib/archlinux.sh" "piney" "--debug";
	source "$(dirname "$0")/../projects/github.sh" "--debug";
else
	source "$(dirname "$0")/_lib/archlinux.sh" "piney";
	source "$(dirname "$0")/../projects/github.sh";
fi;


#
# XXX: MAIN software
#

synchronize filesystem bash;
synchronize trizen;

install-own i3-desktop;

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
synchronize ffmpeg celluloid lollypop;
synchronize dnsutils macchanger net-tools nmap;

#
# XXX: AUR software
#

synchronize wireless-regdb-pentest;

synchronize auto-tagger;
synchronize chromium-extensions;
synchronize pacman-backup;

#
# XXX: GIT software
#

confirm_github;

if [ "$?" == "0" ]; then
	clone_github;
fi;

#
# XXX: System config
#

sudo systemctl enable sshd;
sudo systemctl start sshd;

sudo chmod +r /etc/NetworkManager/system-connections;

i3status_conf="/home/cookiengineer/.config/i3status/config";
if [[ ! -f "$i3status_conf" ]]; then
	mkdir -p $(dirname $i3status_conf);
	cp "$PROFILE_ROOT$i3status_conf" $i3status_conf;
fi;

# TODO: Activate openssh service
gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-battery-type blank;

