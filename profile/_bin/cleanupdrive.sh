#!/bin/bash

# Clear unnecessary locales
cd /usr/share/locale;

sudo rm -rf af am an ang ar as ast az az_IR bal be be@latin "bg" bn bn_IN bo br bs;
sudo rm -rf ca ca@valencia crh cs csb cy da de dz el eo es et eu fa "fi" fr fur fy;
sudo rm -rf ga gd gl gu gv ha he hi hr hu hy ia id ig ilo io is it ja ka kg kk km;
sudo rm -rf kn ko ku ky lg li ln lo lt lv mai mg mi mk ml mn mr ms my nb nds ne nl;
sudo rm -rf nn nso oc or pa pl ps pt pt_BR ro ru rw si sk sl sq sr sr@ije sr@latin sv;
sudo rm -rf ta te tg th tk tl tr tt ug uk ur uz uz@cyrillic vi wa wo xh yi yo zh_CN;
sudo rm -rf zh_HK zh_TW zu;
sudo rm -rf en@arabic en_AU en_CA en_NZ en@hebrew en@piglatin en@shaw en_US@piglatin;

# Clear pacman cache
sudo rm -rf /var/cache/pacman/pkg/*.pkg.tar.xz;

# Clear unnecessary docs
sudo rm -rf /usr/share/gtk-doc/*;
sudo rm -rf /usr/share/doc/*;


cd /;

# Clear unnecessary caches
if [ -d /home/$USER ]; then

	cd /home/$USER;

	rm -rf .thumbnails;
	rm -rf .npm .node-gyp .audacity-data;


	cd /home/$USER/.cache;

	rm -rf pacaur totem;
	rm -rf lycheejs-editor lycheejs-ranger lycheejs-studio nwjs research;


	cd /home/$USER/.config;

	rm -rf lycheejs-editor lycheejs-ranger lycheejs-studio nwjs research;

fi;

