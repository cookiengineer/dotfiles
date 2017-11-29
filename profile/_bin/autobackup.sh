#!/bin/bash


SELF_BACKUP=`which autobackup 2> /dev/null`;

#ROOT_FOLDER=$(cd $(dirname "$0"); pwd);
ROOT_FOLDER="/home/$USER/BACKUP";
FLAG="$1";
TARGET_FOLDER="$2";

if [ "$1" == "" ] && [ "$2" == "" ]; then

	echo "Usage: autobackup [flag] [target]";
	echo "";
	echo "The root folder (where git repositories are stored)";
	echo "will always be ~/BACKUP. Use a symlink if desired.";
	echo "";
	echo "Flags:";
	echo "";
	echo "    --sync      syncs local repositories";
	echo "    --export    exports to folder as tar.gz";
	echo "    --import    imports from folder as tar.gz";
	echo "";
	echo "Examples:";
	echo "";
	echo "    # Create backup on first machine";
	echo "    autobackup --export /media/cookiengineer/EXTERN";
	echo "";
	echo "    # Restore backup on second machine";
	echo "    autobackup --import /media/cookiengineer/EXTERN";
	echo "";

	exit 1;

fi;


if [ ! -d "$ROOT_FOLDER" ]; then
	mkdir -p "$ROOT_FOLDER/export";
	mkdir -p "$ROOT_FOLDER/mirror";
	mkdir -p "$ROOT_FOLDER/repo";
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

	if [ "$FLAG" == "--import" ]; then

		echo "import $orga/$repo";

		if [ ! -d "$ROOT_FOLDER/repo/$orga" ]; then
			mkdir -p "$ROOT_FOLDER/repo/$orga";
		fi;

		if [ "$TARGET_FOLDER" != "" ]; then

			if [ -f "$TARGET_FOLDER/export/$orga/$repo.mirror.tar.gz" ]; then
				tar xf "$TARGET_FOLDER/export/$orga/$repo.mirror.tar.gz" -C "$ROOT_FOLDER/repo/$orga";
			fi;

		else

			if [ -f "$ROOT_FOLDER/export/$orga/$repo.mirror.tar.gz" ]; then
				tar xf "$ROOT_FOLDER/export/$orga/$repo.mirror.tar.gz" -C "$ROOT_FOLDER/repo/$orga";
			fi;

		fi;

	fi;


	echo "sync   $orga/$repo";

	if [ ! -d "$ROOT_FOLDER/mirror/$orga/$repo" ]; then

		cd "$ROOT_FOLDER";
		mkdir -p "$ROOT_FOLDER/mirror/$orga/$repo";

		git clone --mirror --progress "https://github.com/$orga/$repo.git" "$ROOT_FOLDER/mirror/$orga/$repo/.git";

	elif [ -d "$ROOT_FOLDER/mirror/$orga/$repo" ]; then

		cd "$ROOT_FOLDER/mirror/$orga/$repo";

		changes=$(git status --porcelain);

		if [ "$changes" == "" ]; then

			git config --bool core.bare false;
			git checkout -f "$branch" --quiet;
			git fetch origin $branch --quiet --update-head-ok;
			git reset --hard $branch;

			echo "OKAY";

		else

			git fetch origin $branch --quiet --update-head-ok;

			echo "error: repo has local changes, but fetched changes";
			echo "SKIP";

		fi;

	fi;


	if [ "$FLAG" == "--export" ]; then

		echo "export $orga/$repo";

		cd "$ROOT_FOLDER/mirror/$orga";

		if [ "$TARGET_FOLDER" != "" ]; then

			if [ ! -d "$TARGET_FOLDER/export/$orga" ]; then
				mkdir -p "$TARGET_FOLDER/export/$orga";
			fi;

			tar czf "$TARGET_FOLDER/export/$orga/$repo.mirror.tar.gz" ./$repo;

		else

			if [ ! -d "$ROOT_FOLDER/export/$orga" ]; then
				mkdir -p "$ROOT_FOLDER/export/$orga";
			fi;

			tar czf "$ROOT_FOLDER/export/$orga/$repo.mirror.tar.gz" ./$repo;

		fi;

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

	if [ "$FLAG" == "--import" ]; then

		echo "import $orga/$repo";

		if [ ! -d "$ROOT_FOLDER/repo/$orga" ]; then
			mkdir -p "$ROOT_FOLDER/repo/$orga";
		fi;

		if [ "$TARGET_FOLDER" != "" ]; then

			if [ -f "$TARGET_FOLDER/export/$orga/$repo.tar.gz" ]; then
				tar xf "$TARGET_FOLDER/export/$orga/$repo.tar.gz" -C "$ROOT_FOLDER/repo/$orga";
			fi;

		else

			if [ -f "$ROOT_FOLDER/export/$orga/$repo.tar.gz" ]; then
				tar xf "$ROOT_FOLDER/export/$orga/$repo.tar.gz" -C "$ROOT_FOLDER/repo/$orga";
			fi;

		fi;

	fi;


	echo "sync   $orga/$repo";

	if [ ! -d "$ROOT_FOLDER/repo/$orga/$repo" ]; then

		cd "$ROOT_FOLDER";
		mkdir -p "$ROOT_FOLDER/repo/$orga/$repo";

		git clone --progress "https://github.com/$orga/$repo.git" "$ROOT_FOLDER/repo/$orga/$repo";

	elif [ -d "$ROOT_FOLDER/repo/$orga/$repo" ]; then

		cd "$ROOT_FOLDER/repo/$orga/$repo";

		changes=$(git status --porcelain);

		if [ "$changes" == "" ]; then

			git checkout $branch --quiet;
			git fetch origin $branch --quiet;
			git reset --hard origin/$branch;

			echo "OKAY";

		else

			git fetch origin $branch --quiet;

			echo "error: repo has local changes, but fetched changes";
			echo "SKIP";

		fi;

	fi;


	if [ "$FLAG" == "--export" ]; then

		echo "export $orga/$repo";

		cd "$ROOT_FOLDER/repo/$orga/";

		if [ "$TARGET_FOLDER" != "" ]; then

			if [ ! -d "$TARGET_FOLDER/export/$orga" ]; then
				mkdir -p "$TARGET_FOLDER/export/$orga";
			fi;

			tar czf "$TARGET_FOLDER/export/$orga/$repo.tar.gz" ./$repo;

		else

			if [ ! -d "$ROOT_FOLDER/export/$orga" ]; then
				mkdir -p "$ROOT_FOLDER/export/$orga";
			fi;

			tar czf "$ROOT_FOLDER/export/$orga/$repo.tar.gz" ./$repo;

		fi;


	fi;

}

_backup_self() {

	if [ "$FLAG" == "--export" ]; then

		if [ "$TARGET_FOLDER" != "" ]; then

			if [ -f "$SELF_BACKUP" ]; then
				cp "$SELF_BACKUP" "$TARGET_FOLDER/autobackup.sh";
			fi;

			if [ -f "$SELF_RESTORE" ]; then
				cp "$SELF_RESTORE" "$TARGET_FOLDER/autorestore.sh";
			fi;

		fi;

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
_backup_repo "cookiengineer" "backprop-neat-js";
_backup_repo "cookiengineer" "cookiengineer.github.io";
_backup_repo "cookiengineer" "dotfiles";
_backup_repo "cookiengineer" "git-cockpit";
_backup_repo "cookiengineer" "git-ddiff";
_backup_repo "cookiengineer" "git-work";
_backup_repo "cookiengineer" "icon-webfont-exporter";
_backup_repo "cookiengineer" "jarhead-printer";
_backup_repo "cookiengineer" "packup";
_backup_repo "cookiengineer" "printer-driver-dell1130";
_backup_repo "cookiengineer" "sprite-tool";
_backup_repo "cookiengineer" "ultimate-robot-kit";
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


_backup_self;

