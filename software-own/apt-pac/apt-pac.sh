#!/bin/bash

# Save this file as /usr/bin/apt-pac and chmod +x it.

case "$1" in 

	autoremove)
		pacman -Rns $(pacman -Qdtq);
	;;

	clean)
		# XXX: pacman -Scc will remove all packages
		# but we want to keep backups of current ones
		pacman -Sc;
	;;

	changelog)
		pacman -Qc "$2";
	;;

	download)
		pacman -Sw "$2";
	;;

	install)
		pacman -S "$2";
	;;

	policy)
		cat /etc/pacman.d/mirrorlist | grep "^[^#]";
	;;

	rdepends)
		pacman -Sii "$2";
	;;

	remove)
		pacman -Rs "$2";
	;;

	search)
		pacman -Ss "$2";
	;;

	show)
		pacman -Qi "$2";
	;;

	update)
		pacman -Syy;
	;;

	upgrade)
		pacman -Su;
	;;


	*|help)

		echo "";
		echo "aptpac - pacman wrapper for apt-get syntax";
		echo "";
		echo "";
		echo "APT commands:";
		echo "";
		echo -e "\tautoremove, clean, update, upgrade, policy";
		echo "";
		echo "Package-specific commands:";
		echo "";
		echo -e "\tchangelog, download, install, rdepends, remove, search, show";
		echo "";

	;;

esac;

