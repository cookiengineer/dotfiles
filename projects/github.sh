#!/bin/bash

DEBUG_FLAG="false";

if [ "$1" == "--debug" ]; then
	DEBUG_FLAG="true";
fi;

if [ "$SUDO_USER" != "" ]; then
	SOFTWARE="/home/$SUDO_USER/Software";
elif [ "$USER" != "" ]; then
	SOFTWARE="/home/$USER/Software";
fi;



confirm_github () {

	echo "";
	echo "Please add your OpenSSH key to GitHub, GitLab and Jarvis now.";
	echo "";

	echo "- - - - - - - - - - - - - - - -";
	ssh_key=$(cat ~/.ssh/id_rsa.pub | cut -d" " -f1-2);
	echo "$ssh_key";
	echo "- - - - - - - - - - - - - - - -";

	echo "";
	read -p "Confirm when you're done. [y/n] " -n 1 -r;

	if [ "$REPLY" == "y" ]; then

		echo "";
		echo "";

		return 0;

	else

		echo "";
		echo "";

		return 1;

	fi;

}

__remove_remotes_repo () {

	orga="$1";
	repo="$2";
	folder="$SOFTWARE/${orga}/${repo}";

	cd "${folder}";

	git remote remove github;
	git remote remove gitlab;
	git remote remove jarvis;

}

__add_remotes_repo () {

	orga="$1";
	repo="$2";
	folder="$SOFTWARE/${orga}/${repo}";

	check_github=$(cat "${folder}/.git/config" | grep "\[remote \"github\"\]");
	check_gitlab=$(cat "${folder}/.git/config" | grep "\[remote \"gitlab\"\]");
	check_jarvis=$(cat "${folder}/.git/config" | grep "\[remote \"jarvis\"\]");

	if [ "$check_github" == "" ] || [ "$check_gitlab" == "" ] || [ "$check_jarvis" == "" ]; then

		if [ "$DEBUG_FLAG" == "true" ]; then
			echo "|";
			echo "|-> cd \"${folder}\"";
		fi;

		if [ "$check_github" == "" ]; then

			if [ "$DEBUG_FLAG" == "true" ]; then
				echo "|-> git remote add github \"git@github.com:${orga}/${repo}.git\"";
			fi;

			cd "${folder}";
			git remote add github "git@github.com:${orga}/${repo}.git";

		fi;

		if [ "$check_gitlab" == "" ]; then

			if [ "$DEBUG_FLAG" == "true" ]; then
				echo "|-> git remote add gitlab \"git@gitlab.com:${orga}/${repo}.git\"";
			fi;

			cd "${folder}";
			git remote add gitlab "git@gitlab.com:${orga}/${repo}.git";

		fi;

		if [ "$check_jarvis" == "" ]; then

			if [ "$DEBUG_FLAG" == "true" ]; then
				echo "|-> git remote add jarvis \"gitea@jarvis:${orga}/${repo}.git\"";
			fi;

			cd "${folder}";
			git remote add jarvis "gitea@jarvis:${orga}/${repo}.git";

		fi;

	fi;

}

__clone_github_repo () {

	orga="$1";
	repo="$2";
	folder="$SOFTWARE/${orga}/${repo}";

	cloned="no";
	config="no";

	if [ ! -d "${folder}/.git" ]; then

		if [ "$DEBUG_FLAG" == "true" ]; then
			echo "|";
			echo "|-> git clone \"git@github.com:${orga}/${repo}.git\" \"${folder}\"";
		fi;

		mkdir -p "$folder";
		git clone "git@github.com:${orga}/${repo}.git" "${folder}";

		if [ "$?" == "0" ]; then
			cloned="yes";
		fi;

	else

		cloned="yes";

	fi;

	if [ "$cloned" == "yes" ]; then

		__add_remotes_repo "${orga}" "${repo}";

		config="yes";

	fi;

}

clone_github () {

	if [ ! -d "$SOFTWARE" ]; then
		mkdir "$SOFTWARE";
	fi;

	__clone_github_repo cookiengineer agenda;
	__clone_github_repo cookiengineer anet-a8-upgrades;
	__clone_github_repo cookiengineer bananaphone;
	__clone_github_repo cookiengineer cookie.engineer;
	__clone_github_repo cookiengineer cookiengineer;
	__clone_github_repo cookiengineer defiant;
	__clone_github_repo cookiengineer dotfiles;
	__clone_github_repo cookiengineer dotvim;
	__clone_github_repo cookiengineer evac;
	__clone_github_repo cookiengineer experiments;
	__clone_github_repo cookiengineer git-work;
	__clone_github_repo cookiengineer github-scrumboard;
	__clone_github_repo cookiengineer gnome-shell-extension-outta-space;
	__clone_github_repo cookiengineer infiltrator;
	__clone_github_repo cookiengineer lycheejs;
	__clone_github_repo cookiengineer lycheejs-website;
	__clone_github_repo cookiengineer machine-learning-for-dummies;
	__clone_github_repo cookiengineer me-want-cookies;
	__clone_github_repo cookiengineer pacman-backup;
	__clone_github_repo cookiengineer research;
	__clone_github_repo cookiengineer switchine;
	__clone_github_repo cookiengineer talks;
	__clone_github_repo cookiengineer writeups;

	__clone_github_repo tholian-network browser-specifications;
	__clone_github_repo tholian-network intel;
	__clone_github_repo tholian-network intel-examples;
	__clone_github_repo tholian-network intel-prototype;
	__clone_github_repo tholian-network meta;
	__clone_github_repo tholian-network oversight;
	__clone_github_repo tholian-network oversight-prototype;
	__clone_github_repo tholian-network radar;
	__clone_github_repo tholian-network recon;
	__clone_github_repo tholian-network retrokit;
	__clone_github_repo tholian-network stealth;
	__clone_github_repo tholian-network stealth-android;
	__clone_github_repo tholian-network stealth-vendor;
	__clone_github_repo tholian-network stealthify;
	__clone_github_repo tholian-network tholian-network.github.io;
	__clone_github_repo tholian-network vulnerabilities;

}

