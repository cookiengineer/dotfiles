#!/bin/bash

tracker reset --hard --config;

rm -rf ~/.cache/tracker;
rm -rf ~/.config/tracker;
rm -rf ~/.local/share/tracker;

dconf reset -f /org/freedesktop/tracker/;
tracker daemon -s;

tracker daemon -f

