#!/bin/bash


_download_crx () {

	url="$1";
	crx=$(basename $url);
	file=$(basename "$(dirname $url)");

	ver="83.0";
	crx_url="https://clients2.google.com/service/update2/crx?response=redirect&prodversion=$ver&acceptformat=crx2,crx3&x=id%3D$crx%26uc";

	wget -O "/home/$USER/Downloads/CRX/$file.crx" "$crx_url";

}


if [ ! -d "/home/$USER/Downloads/CRX" ]; then
	mkdir -p "/home/$USER/Downloads/CRX";
fi;


if [[ "$(which wget 2>/dev/null)" == "" ]]; then
	sudo pacman -S --needed --noconfirm wget;
fi;


if [[ "$(which wget 2>/dev/null)" != "" ]]; then

	_download_crx "https://chrome.google.com/webstore/detail/cookie-autodelete/fhcgjolkccmbidfldomjliifgaodjagh";
	_download_crx "https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm";
	_download_crx "https://chrome.google.com/webstore/detail/umatrix/ogfcmafjalglgifnmanfmnieipoejdcf";

fi;

