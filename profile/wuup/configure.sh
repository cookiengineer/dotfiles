#!/bin/bash

PROFILE=$(cd "$(dirname "$0")/"; pwd);

if [ "$USER" == "" ]; then
	USER="cookiengineer";
fi;

_clone_github() {

	url="$1";

	if [ -d "/home/$USER/Software/$url" ]; then

		cd "/home/$USER/Software/$url";

		branch=$(git symbolic-ref -q --short HEAD);
		git pull origin $branch;

	else

		cd "/home/$USER/Software";
		mkdir "/home/$USER/Software/$url";

		git clone "https://github.com/$url.git" "$url";

		if [ "$?" == "0" ]; then

			cd "$url";
			git remote add upstream "git@github.com:$url.git";

		fi;

	fi;

}



if [ -d "/home/$USER" ]; then

	if [ ! -d "/home/$USER/Software" ]; then
		mkdir "/home/$USER/Software";
	fi;



	if [ ! -d "/home/$USER/Software/Artificial-Engineering" ]; then
		mkdir -p "/home/$USER/Software/Artificial-Engineering";
	fi;

	_clone_github "Artificial-Engineering/lycheejs-future";
	_clone_github "Artificial-Engineering/lycheejs-garden";
	_clone_github "Artificial-Engineering/lycheejs-guide";

	_clone_github "Artificial-Engineering/lycheejs-legacy";
	_clone_github "Artificial-Engineering/lycheejs-library";
	_clone_github "Artificial-Engineering/lycheejs-harvester";
	_clone_github "Artificial-Engineering/lycheejs-website";

	# _clone_github "Artificial-Engineering/AE-CICD";
	# _clone_github "Artificial-Engineering/AE-github-todo";
	# _clone_github "Artificial-Engineering/AE-github-scrumboard";
	# _clone_github "Artificial-Engineering/AE-slides";
	# _clone_github "Artificial-Engineering/AE-website" "gh-pages";
	_clone_github "Artificial-Engineering/offgrid-browser";
	# _clone_github "Artificial-Engineering/node-sdl-runtime";


	if [ ! -d "/home/$USER/Software/Artificial-University" ]; then
		mkdir -p "/home/$USER/Software/Artificial-University";
	fi;

	_clone_github "Artificial-University/lecture-tool";


	if [ ! -d "/home/$USER/Software/cookiengineer" ]; then
		mkdir -p "/home/$USER/Software/cookiengineer";
	fi;

	_clone_github "cookiengineer/abs";
	_clone_github "cookiengineer/dotfiles";
	_clone_github "cookiengineer/.vim";
	# _clone_github "cookiengineer/git-hollywood";
	# _clone_github "cookiengineer/icon-webfont-exporter";
	# _clone_github "cookiengineer/printer-driver-dell1130";
	# _clone_github "cookiengineer/screencast-to-youtube";

	_clone_github "cookiengineer/random-experiments";
	_clone_github "cookiengineer/lycheejs-experiments";


	gsettings set org.gnome.desktop.interface gtk-theme "Arc-Dark";
	gsettings set org.gnome.desktop.interface icon-theme "Arc";

	gsettings set org.gnome.desktop.background primary-color "#023c88";
	gsettings set org.gnome.desktop.background secondary-color "#5789ca";

	gsettings set org.gnome.desktop.peripherals.keyboard delay 150;
	gsettings set org.gnome.desktop.peripherals.keyboard repeat true;
	gsettings set org.gnome.desktop.peripherals.keyboard repeat-interval 25;

	cp $PROFILE/../background.jpg "/home/$USER/Pictures/background.jpg";
	gsettings set org.gnome.desktop.background picture-options "stretched";
	gsettings set org.gnome.desktop.background picture-uri "file:///home/$USER/Pictures/background.jpg";

	echo -e "[Settings]\n" > "/home/$USER/.config/gtk-3.0/settings.ini";
	echo -e "gtk-application-prefer-dark-theme=1\n" >> "/home/$USER/.config/gtk-3.0/settings.ini";


	rm -f /home/$USER/.vimrc;
	rm -rf /home/$USER/.vim;

	ln -s "/home/$USER/Software/cookiengineer/.vim" /home/$USER/.vim;
	ln -s "/home/$USER/Software/cookiengineer/.vim/.vimrc" /home/$USER/.vimrc;

	if [ ! -d /home/$USER/.vim/bundle/Vundle.vim ]; then
		git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim;
	fi;

fi;

