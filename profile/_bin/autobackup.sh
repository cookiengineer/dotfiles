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


_backup_repo() {

	host="$1";
	orga="$2";
	repo="$3";
	branch="$4";
	project="$5";


	source_orga="$ROOT_FOLDER/repo/$orga";
	source_repo="$ROOT_FOLDER/repo/$orga/$repo";
	target_orga="$TARGET_FOLDER/export/$orga";
	target_repo="$TARGET_FOLDER/export/$orga/$repo";


	if [ "$project" != "" ]; then
		source_repo="$ROOT_FOLDER/repo/$orga/$project/$repo";
		target_repo="$TARGET_FOLDER/export/$orga/$project/$repo";
	fi;


	if [ "$branch" == "" ]; then
		branch="master";
	fi;

	echo "";

	if [ "$FLAG" == "--import" ]; then

		echo "import $orga/$repo";

		if [ ! -d "$source_repo" ]; then
			mkdir -p "$source_repo";
		fi;

		if [ "$TARGET_FOLDER" != "" ]; then

			if [ -f "$target_repo.tar.gz" ]; then
				tar xf "$target_repo.tar.gz" -C "$source_orga";
			fi;

		else

			if [ -f "$ROOT_FOLDER/export/$orga/$repo.tar.gz" ]; then
				tar xf "$ROOT_FOLDER/export/$orga/$repo.tar.gz" -C "$source_orga";
			fi;

		fi;

	fi;


	echo "sync   $orga/$repo";

	if [ ! -d "$source_repo" ]; then

		cd "$ROOT_FOLDER";
		mkdir -p "$source_repo";
		cd "$source_repo";

		if [ "$host" == "bitbucket" ]; then
			git clone --progress "git@bitbucket.org:$orga/$repo.git" "$source_repo";
			git fetch origin --tags;
		elif [ "$host" == "github" ]; then
			git clone --progress "https://github.com/$orga/$repo.git" "$source_repo";
			git fetch origin --tags;
		fi;

	elif [ -d "$source_repo" ]; then

		cd "$source_repo";

		changes=$(git status --porcelain);

		if [ "$changes" == "" ]; then

			git checkout $branch --quiet;
			git fetch origin --tags;
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

		cd "$orga_path";

		if [ "$TARGET_FOLDER" != "" ]; then

			if [ ! -d "$target_orga" ]; then
				mkdir -p "$target_orga";
			fi;

			target_path=$(dirname "$target_repo");
			source_path=$(dirname "$source_repo");

			if [ ! -d "$target_path" ]; then
				mkdir -p "$target_path";
			fi;


			cd $source_path;

			tar czf "$target_repo.tar.gz" ./$repo;

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



# _backup_file "https://github.com/Artificial-Engineering/lycheejs-runtime/releases/download/2017.04.09/lycheejs-runtime.zip";



# UNOFFICIAL STUFF

_backup_repo "bitbucket" "MM-Automation" "automaton.connector" "" "AUTO";
_backup_repo "bitbucket" "MM-Automation" "connector" "" "AUTO";
_backup_repo "bitbucket" "MM-Automation" "mmconnector" "" "AUTO";
_backup_repo "bitbucket" "MM-Automation" "modbusslave" "" "AUTO";
_backup_repo "bitbucket" "MM-Automation" "lycheejs-transpiler" "" "AUTO";

_backup_repo "bitbucket" "MM-Automation" "mm.sc.bdw" "" "MMSC";
_backup_repo "bitbucket" "MM-Automation" "mm.sc.dwb" "" "MMSC";
_backup_repo "bitbucket" "MM-Automation" "mm.sc.vc.generator" "" "MMSC";
_backup_repo "bitbucket" "MM-Automation" "mm.sc.vc.interface" "" "MMSC";
_backup_repo "bitbucket" "MM-Automation" "mm.sc.vc.interface_alt" "" "MMSC";
_backup_repo "bitbucket" "MM-Automation" "mm.sc.vc.merge.bits16_to_word" "" "MMSC";
_backup_repo "bitbucket" "MM-Automation" "mm.sc.vc.split.word_to_bits16" "" "MMSC";



# OFFICIAL STUFF

_backup_repo "github" "Artificial-Engineering" "lycheejs" "development";
_backup_repo "github" "Artificial-Engineering" "lycheejs-runtime";
_backup_repo "github" "Artificial-Engineering" "lycheejs-bundle";
_backup_repo "github" "Artificial-Engineering" "lycheejs-buildbot";
_backup_repo "github" "Artificial-Engineering" "lycheejs-guide";
_backup_repo "github" "Artificial-Engineering" "lycheejs-future";
_backup_repo "github" "Artificial-Engineering" "lycheejs-library";
_backup_repo "github" "Artificial-Engineering" "lycheejs-harvester";
_backup_repo "github" "Artificial-Engineering" "lycheejs-website";
_backup_repo "github" "Artificial-Engineering" "gnome-shell-extension-lycheejs";

_backup_repo "github" "Artificial-Engineering" "AE-CICD";
_backup_repo "github" "Artificial-Engineering" "AE-website" "gh-pages";
_backup_repo "github" "Artificial-Engineering" "research";
_backup_repo "github" "Artificial-Engineering" "node-websdl";

_backup_repo "github" "Artificial-University" "adblock-proxy";
_backup_repo "github" "Artificial-University" "AU-courses";
_backup_repo "github" "Artificial-University" "AU-lecture-tool";
_backup_repo "github" "Artificial-University" "AU-website" "gh-pages";

_backup_repo "github" "INT-WAW" "Boilerplate";
_backup_repo "github" "INT-WAW" "Slides";
_backup_repo "github" "INT-WAW" "git-patrol";



# POLYFILLR STUFF

_backup_repo "github" "polyfillr" "polyfillr.github.io";
_backup_repo "github" "polyfillr" "polyfillr-console";
_backup_repo "github" "polyfillr" "polyfillr-components";
_backup_repo "github" "polyfillr" "polyfillr-ecmascript";
_backup_repo "github" "polyfillr" "polyfillr-framework";



# PRIVATE STUFF

_backup_repo "github" "cookiengineer" ".vim";
_backup_repo "github" "cookiengineer" "anet-a8-upgrades";
_backup_repo "github" "cookiengineer" "backprop-neat-js";
_backup_repo "github" "cookiengineer" "cookiengineer.github.io";
_backup_repo "github" "cookiengineer" "dotfiles";
_backup_repo "github" "cookiengineer" "git-cockpit";
_backup_repo "github" "cookiengineer" "git-ddiff";
_backup_repo "github" "cookiengineer" "git-work";
_backup_repo "github" "cookiengineer" "icon-webfont-exporter";
_backup_repo "github" "cookiengineer" "jarhead-printer";
_backup_repo "github" "cookiengineer" "packup";
_backup_repo "github" "cookiengineer" "printer-driver-dell1130";
_backup_repo "github" "cookiengineer" "sprite-tool";
_backup_repo "github" "cookiengineer" "ultimate-robot-kit";
_backup_repo "github" "cookiengineer" "unimatrix-zero";
_backup_repo "github" "cookiengineer" "vim-typewriter";

_backup_repo "github" "cookiengineer" "lycheejs-experiments";
_backup_repo "github" "cookiengineer" "lycheejs-prototyper";
_backup_repo "github" "cookiengineer" "lycheejs-transpiler";
_backup_repo "github" "cookiengineer" "random-experiments";

# _backup_repo "github" "cookiengineer" "blackberry-desktop-linux";
# _backup_repo "github" "cookiengineer" "N1T1";
# _backup_repo "github" "cookiengineer" "Nidium";
_backup_repo "github" "cookiengineer" "regulex";
_backup_repo "github" "cookiengineer" "root-tapper";
_backup_repo "github" "cookiengineer" "screencast-to-youtube";
_backup_repo "github" "cookiengineer" "stardate.js";

_backup_repo "github" "cookiengineer" "jsconf2014-slides";
_backup_repo "github" "cookiengineer" "machine-learning-for-dummies";
_backup_repo "github" "cookiengineer" "talks";



# BOTS

_backup_repo "github" "humansneednotapply" "dear-github-please-dont-delete-me";



# OTHER

_backup_repo "github" "samyk" "poisontap";
# _backup_file "https://arch-anywhere.org/iso/arch-anywhere-2.2.7-2-x86_64.iso";


_backup_self;

