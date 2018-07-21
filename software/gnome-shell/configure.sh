#!/bin/bash

GSETTINGS_BIN=`which gsettings`;

if [ "$GSETTINGS_BIN" != "" ]; then

	$GSETTINGS_BIN set org.gnome.desktop.wm.preferences audible-bell false;
	$GSETTINGS_BIN set org.gnome.desktop.wm.preferences button-layout "appmenu:minimize,maximize,close";


	if [ -f /etc/manjaro-release ]; then

		$GSETTINGS_BIN set org.gnome.desktop.interface gtk-theme "Adapta-Nokto-Eta-Maia";
		$GSETTINGS_BIN set org.gnome.desktop.interface icon-theme "Papirus-Adapta-Nokto-Maia";

	else

		$GSETTINGS_BIN set org.gnome.desktop.interface gtk-theme "Arc-Dark";
		$GSETTINGS_BIN set org.gnome.desktop.interface icon-theme "Arc";

	fi;


	$GSETTINGS_BIN set org.gnome.desktop.background primary-color "#023c88";
	$GSETTINGS_BIN set org.gnome.desktop.background secondary-color "#5789ca";

	$GSETTINGS_BIN set org.gnome.desktop.peripherals.keyboard delay 150;
	$GSETTINGS_BIN set org.gnome.desktop.peripherals.keyboard repeat true;
	$GSETTINGS_BIN set org.gnome.desktop.peripherals.keyboard repeat-interval 25;

fi;


if [ "$SUDO_USER" != "" ]; then
	GTK_RC="/home/$SUDO_USER/.config/gtk-3.0/settings.ini";
elif [ "$USER" != "" ]; then
	GTK_RC="/home/$USER/.config/gtk-3.0/settings.ini";
fi;

if [ "$GTK_RC" != "" ] && [ ! -f $GTK_RC ]; then

	mkdir -p $(dirname $GTK_RC);

	echo -e "[Settings]\n" > $GTK_RC;
	echo -e "gtk-application-prefer-dark-theme=1\n" >> $GTK_RC;

fi;

