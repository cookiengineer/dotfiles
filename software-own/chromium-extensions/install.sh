#!/bin/bash


_download_crx () {

	name="$1";
	crx_id="$2";
	crx_version="74.0";
	crx_url="https://clients2.google.com/service/update2/crx?response=redirect&prodversion=$crx_version&x=id%3D$crx_id%26installsource%3Dondemand%26uc";

	echo "$crx_url";

	curl -sL "$crx_url" > "/home/$USER/Downloads/CRX/$name.crx";

}


if [ ! -d "/home/$USER/Downloads/CRX" ]; then
	mkdir -p "/home/$USER/Downloads/CRX";
fi;


CURL_BIN=`which curl`;

if [ "$CURL_BIN" == "" ]; then

	sudo pacman -S --needed --noconfirm curl;
	CURL_BIN=`which curl`;

fi;


if [ "$CURL_BIN" != "" ]; then

	_download_crx "cookie-autodelete" "fhcgjolkccmbidfldomjliifgaodjagh";
	_download_crx "dark-reader"       "eimadpbcbfnmbkopoojfekhnkhdbieeh";
	_download_crx "ublock-origin"     "cjpalhdlnbpafiamejdnhcphjbkeiagm";
	_download_crx "umatrix"           "ogfcmafjalglgifnmanfmnieipoejdcf";

fi;

