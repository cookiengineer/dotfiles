#!/bin/bash

ROOT_FOLDER="/home/$USER/BACKUP";
FLAG="$1";

if [ ! -d "/home/$USER/BACKUP" ]; then
	mkdir -p "/home/$USER/BACKUP/export";
	mkdir -p "/home/$USER/BACKUP/mirror";
	mkdir -p "/home/$USER/BACKUP/repo";
fi;



_backup_file() {

	url="$1";
	file=$(basename $url);

	echo "";
	echo "backup $file";

	if [ ! -f "$ROOT_FOLDER/$file" ]; then

		cd "$ROOT_FOLDER";
		curl -sSL $url > $file;

	fi;

}

_backup_mirror() {

	orga="$1";
	repo="$2";
	branch="$3";

	if [ "$branch" == "" ]; then
		branch="master";
	fi;

	echo "";
	echo "backup $orga/$repo";

	if [ ! -d "$ROOT_FOLDER/mirror/$orga/$repo" ]; then

		cd "$ROOT_FOLDER";
		mkdir -p "$ROOT_FOLDER/mirror/$orga/$repo";

		git clone --mirror --progress "https://github.com/$orga/$repo.git" "$ROOT_FOLDER/mirror/$orga/$repo/.git";

	elif [ -d "$ROOT_FOLDER/mirror/$orga/$repo" ]; then

		cd "$ROOT_FOLDER/mirror/$orga/$repo";
		git config --bool core.bare false;
		git checkout -f "$branch" --quiet;
		git fetch origin $branch --quiet --update-head-ok;
		git reset --hard $branch;

	fi;


	if [ "$FLAG" == "--export" ]; then

		if [ ! -d "$ROOT_FOLDER/export/$orga" ]; then
			mkdir -p "../export/$orga";
		fi;

		cd "$ROOT_FOLDER/mirror/$orga";
		tar czvf "../export/$orga/$repo.tar.gz" ./$repo;

	fi;

}


_backup_repo() {

	orga="$1";
	repo="$2";
	branch="$3";

	if [ "$branch" == "" ]; then
		branch="master";
	fi;

	echo "";
	echo "backup $orga/$repo";

	if [ ! -d "$ROOT_FOLDER/repo/$orga/$repo" ]; then

		cd "$ROOT_FOLDER";
		mkdir -p "$ROOT_FOLDER/repo/$orga/$repo";

		git clone --progress "https://github.com/$orga/$repo.git" "$ROOT_FOLDER/repo/$orga/$repo";

	elif [ -d "$ROOT_FOLDER/repo/$orga/$repo" ]; then

		cd "$ROOT_FOLDER/repo/$orga/$repo";
		git checkout $branch --quiet;
		git fetch origin $branch --quiet;
		git reset --hard origin/$branch;

	fi;


	if [ "$FLAG" == "--export" ]; then

		if [ ! -d "$ROOT_FOLDER/export/$orga" ]; then
			mkdir -p "../export/$orga";
		fi;

		cd "$ROOT_FOLDER/repo/$orga/";
		tar czvf "../export/$orga/$repo.tar.gz" ./$repo;

	fi;

}



# XXX: HG FLOW STUFF (all branches)

# _backup_file "https://github.com/Artificial-Engineering/lycheejs-runtime/releases/download/2017.04.09/lycheejs-runtime.zip";
_backup_mirror "Artificial-Engineering" "lycheejs" "development";


# OFFICIAL STUFF

_backup_repo "Artificial-Engineering" "lycheejs" "development";
_backup_repo "Artificial-Engineering" "lycheejs-runtime";
_backup_repo "Artificial-Engineering" "lycheejs-bundle";
_backup_repo "Artificial-Engineering" "lycheejs-buildbot";
_backup_repo "Artificial-Engineering" "lycheejs-guide";
_backup_repo "Artificial-Engineering" "lycheejs-future";

_backup_repo "Artificial-Engineering" "lycheejs-library";
_backup_repo "Artificial-Engineering" "lycheejs-harvester";
_backup_repo "Artificial-Engineering" "lycheejs-website";

_backup_repo "Artificial-Engineering" "AE-CICD";
_backup_repo "Artificial-Engineering" "AE-website" "gh-pages";
_backup_repo "Artificial-Engineering" "research";
_backup_repo "Artificial-Engineering" "node-websdl";

_backup_repo "Artificial-University" "adblock-proxy";
_backup_repo "Artificial-University" "AU-courses";
_backup_repo "Artificial-University" "AU-lecture-tool";
_backup_repo "Artificial-University" "AU-website" "gh-pages";

_backup_repo "INT-WAW" "Boilerplate";
_backup_repo "INT-WAW" "Slides";
_backup_repo "INT-WAW" "git-patrol";



# POLYFILLR STUFF

_backup_repo "polyfillr" "polyfillr.github.io";
_backup_repo "polyfillr" "polyfillr-console";
_backup_repo "polyfillr" "polyfillr-components";
_backup_repo "polyfillr" "polyfillr-ecmascript";
_backup_repo "polyfillr" "polyfillr-framework";



# PRIVATE STUFF

_backup_repo "cookiengineer" ".vim";
_backup_repo "cookiengineer" "anet-a8-upgrades";
_backup_repo "cookiengineer" "cookiengineer.github.io";
_backup_repo "cookiengineer" "dotfiles";
_backup_repo "cookiengineer" "git-ddiff";
_backup_repo "cookiengineer" "git-work";
_backup_repo "cookiengineer" "icon-webfont-exporter";
_backup_repo "cookiengineer" "printer-driver-dell1130";
_backup_repo "cookiengineer" "sprite-tool";
_backup_repo "cookiengineer" "unimatrix-zero";
_backup_repo "cookiengineer" "vim-explorer";
_backup_repo "cookiengineer" "vim-typewriter";

_backup_repo "cookiengineer" "lycheejs-experiments";
_backup_repo "cookiengineer" "lycheejs-prototyper";
_backup_repo "cookiengineer" "lycheejs-transpiler";
_backup_repo "cookiengineer" "random-experiments";

# _backup_repo "cookiengineer" "blackberry-desktop-linux";
# _backup_repo "cookiengineer" "N1T1";
# _backup_repo "cookiengineer" "Nidium";
_backup_repo "cookiengineer" "regulex";
_backup_repo "cookiengineer" "root-tapper";
_backup_repo "cookiengineer" "screencast-to-youtube";
_backup_repo "cookiengineer" "stardate.js";

_backup_repo "cookiengineer" "jsconf2014-slides";
_backup_repo "cookiengineer" "machine-learning-for-dummies";
_backup_repo "cookiengineer" "talks";



# BOTS

_backup_repo "humansneednotapply" "dear-github-please-dont-delete-me";



# OTHER

_backup_repo "samyk" "poisontap";
# _backup_file "https://arch-anywhere.org/iso/arch-anywhere-2.2.7-2-x86_64.iso";
