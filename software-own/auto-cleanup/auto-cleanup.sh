#!/bin/bash

_clear_locale () {
	cd /usr/share/locale;
	sudo rm -rf $@ 2> /dev/null;
}

_clear_home () {
	cd "/home/$USER";
	rm -rf $@ 2> /dev/null;
}


# Unnecessary Locales
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


# Pacman Cache
sudo rm -rf /var/cache/pacman/pkg/*.pkg.tar.xz 2> /dev/null;

# Unnecessary Docs
sudo rm -rf /usr/share/gtk-doc/*;
sudo rm -rf /usr/share/doc/*;


if [ "$USER" != "" ]; then

	# Unnecessary Profile Folders
	if [ -d "/home/$USER" ]; then

		# Package Managers
		_clear_home .cargo;
		_clear_home .gradle;
		_clear_home .jd;
		_clear_home .m2;
		_clear_home .node-gyp .npm;
		_clear_home .cache/pip;
		_clear_home .rustup;
		_clear_home .cache/yarn;

		# Build Toolchains
		_clear_home .babel.json;
		_clear_home .cmake;
		_clear_home .mono;
		_clear_home .pylint.d;
		_clear_home .cache/typescript;


		# Other Software
		_clear_home .audacity-data;
		_clear_home .bash_history .bash_logout;
		_clear_home .cache/banshee-1 .config/banshee-1;
		_clear_home .config/blender;
		_clear_home .cache/cura .config/cura;
		_clear_home .cache/dasht;
		_clear_home .config/eog;
		_clear_home .cache/epiphany .config/epiphany;
		_clear_home .esd_auth .cache/event-sound-cache*;
		_clear_home .cache/folks;
		_clear_home .config/gedit;
		_clear_home .gimp-2.8 .config/GIMP;
		_clear_home .cache/gnome-calculator;
		_clear_home .cache/gnome-dictionary-3.0;
		_clear_home .cache/gnome-photos;
		_clear_home .cache/kitty .config/kitty;
		_clear_home .lesshst;
		_clear_home .cache/libgweather;
		_clear_home .cache/media-art;
		_clear_home .config/monitors.xml~;
		_clear_home .cache/qt_compose_cache* .config/QtProject.conf .config/Trolltech.conf;
		_clear_home .ssr;
		_clear_home .swt;
		_clear_home .config/termtosvg;
		_clear_home .thumbnails .cache/thumbnails;
		_clear_home .cache/totem;
		_clear_home .cache/tracker;
		_clear_home .config/trizen;
		_clear_home .config/uGet;
		_clear_home .cache/vim;
		_clear_home .config/VirtualBox;
		_clear_home .cache/webkitgtk;
		_clear_home .wget-hsts;
		_clear_home .cache/wine;
		_clear_home .config/wireshark;
		_clear_home .xsession-errors .xsession-errors.old;


		# lychee.js Software
		_clear_home .cache/lycheejs-ranger .cache/lycheejs-studio;
		_clear_home .config/lycheejs-ranger .config/lycheejs-studio;
		_clear_home .cache/nwjs .cache/research;
		_clear_home .config/nwjs .config/research;

	fi;

fi;

