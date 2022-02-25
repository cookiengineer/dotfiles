#!/bin/bash

ACTION="reset";

if [[ "$1" == "increase" ]]; then
	ACTION="increase";
elif [[ "$1" == "decrease" ]]; then
	ACTION="decrease";
elif [[ "$1" == "status" ]]; then
	ACTION="status";
fi;


get_brightness() {
	echo $(xrandr --verbose | grep -m 1 -w "$1 connected" -A8 | grep "Brightness" | cut -f2- -d":" | tr -d " ");
}

increase() {

	case "$1" in
		"1.0"*)  echo "1.0";  ;;
		"0.95"*) echo "1.0";  ;;
		"0.90"*) echo "0.95"; ;;
		"0.85"*) echo "0.90"; ;;
		"0.80"*) echo "0.85"; ;;
		"0.75"*) echo "0.80"; ;;
		"0.70"*) echo "0.75"; ;;
		"0.65"*) echo "0.70"; ;;
		"0.60"*) echo "0.65"; ;;
		"0.55"*) echo "0.60"; ;;
		"0.50"*) echo "0.55"; ;;
		"0.45"*) echo "0.50"; ;;
		"0.40"*) echo "0.45"; ;;
		"0.35"*) echo "0.40"; ;;
		"0.30"*) echo "0.35"; ;;
		"0.25"*) echo "0.30"; ;;
		"0.20"*) echo "0.25"; ;;
		"0.15"*) echo "0.20"; ;;
		"0.10"*) echo "0.15"; ;;
		"0.05"*) echo "0.10"; ;;
		"0.0"*)  echo "0.05"; ;;
		*)       echo "1.0";  ;;
	esac;

}

decrease() {

	case "$1" in
		"1.0"*)  echo "0.95"; ;;
		"0.95"*) echo "0.90"; ;;
		"0.90"*) echo "0.85"; ;;
		"0.85"*) echo "0.80"; ;;
		"0.80"*) echo "0.75"; ;;
		"0.75"*) echo "0.70"; ;;
		"0.70"*) echo "0.65"; ;;
		"0.65"*) echo "0.60"; ;;
		"0.60"*) echo "0.55"; ;;
		"0.55"*) echo "0.50"; ;;
		"0.50"*) echo "0.45"; ;;
		"0.45"*) echo "0.40"; ;;
		"0.40"*) echo "0.35"; ;;
		"0.35"*) echo "0.30"; ;;
		"0.30"*) echo "0.25"; ;;
		"0.25"*) echo "0.20"; ;;
		"0.20"*) echo "0.15"; ;;
		"0.15"*) echo "0.10"; ;;
		"0.10"*) echo "0.05"; ;;
		"0.05"*) echo "0.0";  ;;
		"0.0"*)  echo "0.0";  ;;
		*)       echo "1.0";  ;;
	esac;

}

percentage() {

	case "$1" in
		"1.0"*)  echo "100%"; ;;
		"0.95"*) echo " 95%"; ;;
		"0.90"*) echo " 90%"; ;;
		"0.85"*) echo " 85%"; ;;
		"0.80"*) echo " 80%"; ;;
		"0.75"*) echo " 75%"; ;;
		"0.70"*) echo " 70%"; ;;
		"0.65"*) echo " 65%"; ;;
		"0.60"*) echo " 60%"; ;;
		"0.55"*) echo " 55%"; ;;
		"0.50"*) echo " 50%"; ;;
		"0.45"*) echo " 45%"; ;;
		"0.40"*) echo " 40%"; ;;
		"0.35"*) echo " 35%"; ;;
		"0.30"*) echo " 30%"; ;;
		"0.25"*) echo " 25%"; ;;
		"0.20"*) echo " 20%"; ;;
		"0.15"*) echo " 15%"; ;;
		"0.10"*) echo " 10%"; ;;
		"0.05"*) echo "  5%"; ;;
		"0.0"*)  echo "  0%"; ;;
		*)       echo "???%"; ;;
	esac;

}


connected=$(xrandr | grep -w connected | cut -f1 -d' ');

for display in $connected; do

	old_brightness="$(get_brightness "$display")";

	if [[ "$ACTION" == "increase" ]]; then

		new_brightness="$(increase "$old_brightness")";
		echo "-> Set Brightness for Display \"$display\" from \"$old_brightness\" to \"$new_brightness\".";
		xrandr --output "$display" --brightness "$new_brightness";

	elif [[ "$ACTION" == "decrease" ]]; then

		new_brightness="$(decrease "$old_brightness")";
		echo "-> Set Brightness for Display \"$display\" from \"$old_brightness\" to \"$new_brightness\".";
		xrandr --output "$display" --brightness "$new_brightness";

	elif [[ "$ACTION" == "reset" ]]; then
		echo "-> Set Brightness for Display \"$display\" to \"1.0\".";
		xrandr --output "$display" --brightness 1.0;

	elif [[ "$ACTION" == "status" ]]; then

		# First Display is always the Main Display
		echo "$(percentage "$old_brightness")";
		exit 0;

	fi;

done;

