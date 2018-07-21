#!/bin/bash

_clear_locale () {

	cd /usr/share/locale;
	sudo rm -rf $@ 2> /dev/null;

}

_clear_home () {

	cd "/home/$USER";
	rm -rf $@ 2> /dev/null;

}



# Clear unnecessary locales

_clear_locale af am an ang ar as ast az az_IR;
_clear_locale bal be be@latin "bg" bn bn_IN bo br bs;
_clear_locale ca ca@valencia crh cs csb cy;
_clear_locale da de dz;
_clear_locale el en@arabic en_AU en_CA en_NZ en@hebrew en@piglatin en@shaw en_US@piglatin eo es et eu;
_clear_locale fa "fi" fr fur fy;
_clear_locale ga gd gl gu gv;
_clear_locale ha he hi hr hu hy;
_clear_locale ia id ig ilo io is it;
_clear_locale ja;
_clear_locale ka kg kk km kn ko ku ky;
_clear_locale lg li ln lo lt lv;
_clear_locale mai mg mi mk ml mn mr ms my;
_clear_locale nb nds ne nl nn nso;
_clear_locale oc or;
_clear_locale pa pl ps pt pt_BR;
_clear_locale ro ru rw;
_clear_locale si sk sl sq sr sr@ije sr@latin sv;
_clear_locale ta te tg th tk tl tr tt;
_clear_locale ug uk ur uz uz@cyrillic;
_clear_locale vi;
_clear_locale wa wo;
_clear_locale xh yi yo zh_CN zh_HK zh_TW zu;


# Clear pacman cache
sudo rm -rf /var/cache/pacman/pkg/*.pkg.tar.xz 2> /dev/null;

# Clear unnecessary docs
sudo rm -rf /usr/share/gtk-doc/*;
sudo rm -rf /usr/share/doc/*;


# Clear unnecessary user-specific caches
if [ "$USER" != "" ]; then

	if [ -d "/home/$USER" ]; then

		_clear_home .audacity-data;
		_clear_home .thumbnails;
		_clear_home .node-gyp .npm;

		_clear_home .cache/totem;
		_clear_home .cache/lycheejs-ranger .cache/lycheejs-studio;
		_clear_home .cache/nwjs .cache/research;

		_clear_home .config/lycheejs-ranger .config/lycheejs-studio;
		_clear_home .config/nwjs .config/research;

	fi;

fi;

