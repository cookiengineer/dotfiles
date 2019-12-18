#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)";
GSETTINGS_BIN=`which gsettings`;

if [ "$GSETTINGS_BIN" != "" ]; then

	$GSETTINGS_BIN set org.gnome.desktop.wm.preferences audible-bell false;
	$GSETTINGS_BIN set org.gnome.desktop.wm.preferences button-layout "appmenu:minimize,maximize,close";

	$GSETTINGS_BIN set org.gnome.desktop.interface cursor-theme "xcursor-breeze-snow";
	$GSETTINGS_BIN set org.gnome.desktop.interface gtk-theme "Adapta-Nokto-Eta-Maia";
	$GSETTINGS_BIN set org.gnome.desktop.interface icon-theme "Papirus-Adapta-Nokto-Maia";

	$GSETTINGS_BIN set org.gnome.desktop.background primary-color "#023c88";
	$GSETTINGS_BIN set org.gnome.desktop.background secondary-color "#5789ca";

	$GSETTINGS_BIN set org.gnome.desktop.peripherals.keyboard delay 150;
	$GSETTINGS_BIN set org.gnome.desktop.peripherals.keyboard repeat true;
	$GSETTINGS_BIN set org.gnome.desktop.peripherals.keyboard repeat-interval 25;

fi;


if [ "$SUDO_USER" != "" ]; then
	GTK_RC="/home/$SUDO_USER/.config/gtk-3.0/settings.ini";
	BG_DIR="/home/$SUDO_USER/Pictures/Wallpapers";
elif [ "$USER" != "" ]; then
	BG_DIR="/home/$USER/Pictures/Wallpapers";
	GTK_RC="/home/$USER/.config/gtk-3.0/settings.ini";
fi;

if [ "$GTK_RC" != "" ] && [ ! -f $GTK_RC ]; then

	mkdir -p $(dirname $GTK_RC);

	echo -e "[Settings]\n" > $GTK_RC;
	echo -e "gtk-application-prefer-dark-theme=1\n" >> $GTK_RC;

fi;

if [ "$GSETTINGS_BIN" != "" ] && [ "$BG_DIR" != "" ]; then

	mkdir -p "$BG_DIR";
	cp $DIR/neon-space.jpg "$BG_DIR/neon-space.jpg";

	$GSETTINGS_BIN set org.gnome.desktop.background picture-uri "file://$BG_DIR/neon-space.jpg";
	$GSETTINGS_BIN set org.gnome.desktop.background picture-options "zoom";

fi;

