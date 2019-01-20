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
		_clear_home .cache/babl;
		_clear_home .cache/banshee-1 .config/banshee-1;
		_clear_home .config/blender;
		_clear_home .config/cef_user_data;
		_clear_home .cache/cura .config/cura .local/share/cura;
		_clear_home .cache/dasht .local/share/dasht;
		_clear_home .local/share/desktop-directories;
		_clear_home .config/eog;
		_clear_home .cache/epiphany .config/epiphany .local/share/epiphany;
		_clear_home .esd_auth .cache/event-sound-cache*;
		_clear_home .cache/folks .local/share/folks;
		_clear_home .fontconfig .cache/fontconfig;
		_clear_home .config/gedit;
		_clear_home .cache/gegl-0.2 .local/share/gegl-0.2 .cache/gegl-0.3 .local/share/gegl-0.3 .cache/gegl-0.4 .local/share/gegl-0.4;
		_clear_home .gimp-2.8 .config/GIMP;
		_clear_home .cache/gnome-calculator;
		_clear_home .config/gnome-control-center;
		_clear_home .cache/gnome-dictionary-3.0;
		_clear_home .cache/gnome-photos;
		_clear_home .local/share/gnome-shell;
		_clear_home .local/share/grilo-plugins;
		_clear_home .cache/gstreamer-1.0 .local/share/gstreamer-1.0;
		_clear_home .local/share/gtk-doc;
		_clear_home .local/share/gvfs-metadata;
		_clear_home .local/share/icc;
		_clear_home .local/share/icons;
		_clear_home .cache/kitty .config/kitty;
		_clear_home .lesshst;
		_clear_home .local/share/libgda;
		_clear_home .cache/libgweather;
		_clear_home .local/share/localstorage;
		_clear_home .cache/media-art;
		_clear_home .local/share/mime;
		_clear_home .cache/modem-manager-gui local/share/modem-manager-gui;
		_clear_home .config/monitors.xml~;
		_clear_home .local/share/nautilus;
		_clear_home .local/share/recently-used.xbel;
		_clear_home .local/share/sounds;
		_clear_home .local/share/totem;
		_clear_home .local/share/tracker;
		_clear_home .cache/qt_compose_cache* .config/QtProject.conf .config/Trolltech.conf;
		_clear_home .ssr;
		_clear_home .swt;
		_clear_home .config/termtosvg;
		_clear_home .thumbnails .cache/thumbnails;
		_clear_home .cache/totem;
		_clear_home .cache/tracker;
		_clear_home .config/trizen;
		_clear_home .config/uGet;
		_clear_home .config/VeraCrypt;
		_clear_home .cache/vim;
		_clear_home .config/VirtualBox;
		_clear_home .cache/webkitgtk .local/share/webkitgtk;
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

