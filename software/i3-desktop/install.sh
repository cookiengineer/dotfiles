#!/bin/bash

# xorg and default drivers
sudo pacman -S --needed --noconfirm xorg-server xorg-server-common xorg-setxkbmap xorg-xauth xorg-xev xorg-xhost xorg-xinit xorg-xinput xorg-xkbcomp xorg-xmessage xorg-xmodmap xorg-xprop xorg-xrandr xorg-xrdb xorg-xset xorg-xwayland xorgproto;
sudo pacman -S --needed --noconfirm xf86-input-evdev xf86-input-libinput xf86-input-void xf86-video-intel;

# i3wm and necessary tools
sudo pacman -S --needed --noconfirm i3-wm i3status;
sudo pacman -S --needed --noconfirm brightnessctl blueman network-manager-applet;
sudo pacman -S --needed --noconfirm nemo nemo-fileroller nemo-image-converter nemo-preview file-roller;
sudo pacman -S --needed --noconfirm feh lxappearance flameshot;
sudo pacman -S --needed --noconfirm arc-gtk-theme arc-icon-theme;

# pulseaudio
sudo pacman -S --needed --noconfirm pulseaudio pavucontrol;

