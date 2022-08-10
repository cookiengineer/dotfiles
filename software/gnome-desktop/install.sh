#!/bin/bash

# GNOME
sudo pacman -S --needed --noconfirm gnome-bluetooth gnome-calculator gnome-calendar gnome-control-center gnome-desktop gnome-disk-utility gnome-font-viewer gnome-keyring gnome-maps gnome-menus gnome-music gnome-online-accounts gnome-screenshot gnome-session gnome-settings-daemon gnome-shell gnome-system-monitor gnome-terminal gnome-tweak-tool;
sudo pacman -S --needed --noconfirm arc-gtk-theme arc-icon-theme;

# pulseaudio
sudo pacman -S --needed --noconfirm pulseaudio pavucontrol;

