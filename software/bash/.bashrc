#
# ~/.bashrc
#
# XXX: COOKIENGINEERS BASHRC
#

[[ $- != *i* ]] && return

if [ -r /usr/share/bash-completion/bash_completion ]; then
	source /usr/share/bash-completion/bash_completion;
fi;



#
# Shell Options
#

shopt -s checkwinsize;
shopt -s expand_aliases;
shopt -s histappend;
stty -ixon;



#
# Misc Options
#

export PATH=/home/$USER/.cargo/bin:$PATH;
xhost +local:root > /dev/null 2>&1;
complete -cf sudo;



#
# Default Programs and Aliases
#

BROWSER=/usr/bin/chromium;
EDITOR=/usr/bin/vim;

alias cls="clear; printf '\033[3J'"; # clear screen and scroll buffer
alias cp="cp -i";                    # confirm before overwriting something
alias df='df -h';                    # human-readable sizes
alias egrep='egrep --colour=auto';
alias fgrep='fgrep --colour=auto';
alias free='free -m';                # show sizes in MB
alias grep='grep --colour=auto';
alias ls='ls --color=auto';
alias more=less;                     # cmd compatibility
alias mv="mv -i";                    # confirm before overwriting something
alias ns='netstat -tup --wide';      # show only active program sockets



#
# Terminal-Specific Hacks
#

case ${TERM} in
	xterm*|rxvt*|Eterm*|aterm|kterm|gnome*|interix|konsole*)
		PROMPT_COMMAND='echo -ne "\033]0;${USER}@${HOSTNAME%%.*}:${PWD/#$HOME/\~}\007"';
		;;
	screen*)
		PROMPT_COMMAND='echo -ne "\033_${USER}@${HOSTNAME%%.*}:${PWD/#$HOME/\~}\033\\"';
		;;
esac

# Enable colors for ls, etc. Prefer ~/.dir_colors #64489
if [ `which dircolors` != "" ]; then
	if [ -f ~/.dir_colors ]; then
		eval $(dircolors -b ~/.dir_colors);
	elif [ -f /etc/DIR_COLORS ]; then
		eval $(dircolors -b /etc/DIR_COLORS);
	fi;
fi;



#
# Helpers
#

colors() {

	local fgc bgc vals seq0;

	printf "Color escapes are %s\n" '\e[${value};...;${value}m';
	printf "Values 30..37 are \e[33mforeground colors\e[m\n";
	printf "Values 40..47 are \e[43mbackground colors\e[m\n";
	printf "Value  1 gives a  \e[1mbold-faced look\e[m\n\n";

	# foreground colors
	for fgc in {30..37}; do

		# background colors
		for bgc in {40..47}; do

			fgc=${fgc#37}; # white
			bgc=${bgc#40}; # black

			vals="${fgc:+$fgc;}${bgc}";
			vals=${vals%%;};

			seq0="${vals:+\e[${vals}m}";
			printf "  %-9s" "${seq0:-(default)}";
			printf " ${seq0}TEXT\e[m";
			printf " \e[${vals:+${vals+$vals;}}1mBOLD\e[m";

		done

		echo;
		echo;

	done

}



#
# Custom PS1 Status Line
#

__my_ps1() {

	local last_status="$?";
	local code="";
	local user="$USER";
	local host="$HOSTNAME";
	local path="$PWD";

	if [[ "$last_status" == "0" ]]; then
		code="✔️ ";
	elif [[ "$last_status" == "2" ]]; then
		code="🔥";
	else
		code="❌";
	fi;


	local git_dir="$(git rev-parse --git-dir 2>/dev/null)";
	local git_status="";

	if [[ "$git_dir" != "" ]]; then

		local git_branch="";
		local git_commit=$(git rev-parse --short HEAD 2>/dev/null);
		local has_changes=$(git status --porcelain 2>/dev/null);

		local tmp=$(git status --porcelain -b 2>/dev/null);

		if [[ "$tmp" == "## "* ]]; then
			git_branch=$(echo "${tmp//\#\# }" | head -n 1 | cut -f1 -d".");
		fi;
		
		if [[ "$git_branch" != "" ]]; then
			git_status="🔗 $git_branch";
		else
			git_status="🔗 $git_commit";
		fi;

		if [[ "$has_changes" != "" ]]; then
			git_status="$git_status 🚨";
		fi;

	fi;


	if [[ "$user" == "cookiengineer" ]]; then
		user="🍪🔧";
	elif [[ "$user" == "root" ]]; then
		user="🤖";
	fi;

	if [[ "$host" == "nuccy" ]]; then
		host="🖥️";
	elif [[ "$host" == "tinky" ]]; then
		host="💻";
	elif [[ "$host" == "weep" ]]; then
		host="🖥️";
	elif [[ "$host" == "wiip" ]]; then
		host="🍓";
	fi;

	if [[ "$path" == "$HOME/Backup"* ]]; then

		if [[ $(stat --format "%F" "$HOME/Backup") == "symbolic link" ]]; then
			path="${path/"$HOME/Backup"/📀}";
		else
			path="${path/"$HOME/Backup"/💿}";
		fi;

	elif [[ "$path" == "$HOME/Documents"* ]]; then
		path="${path/"$HOME/Documents"/📑}";
	elif [[ "$path" == "$HOME/Downloads"* ]]; then
		path="${path/"$HOME/Downloads"/⛔}";
	elif [[ "$path" == "$HOME/Games"* ]]; then
		path="${path/"$HOME/Games"/🎮}";
	elif [[ "$path" == "$HOME/Music"* ]]; then
		path="${path/"$HOME/Music"/🎵}";
	elif [[ "$path" == "$HOME/Packages"* ]]; then
		path="${path/"$HOME/Packages"/📦}";
	elif [[ "$path" == "$HOME/Pictures"* ]]; then
		path="${path/"$HOME/Pictures"/📷}";
	elif [[ "$path" == "$HOME/Software"* ]]; then
		path="${path/"$HOME/Software"/🚧}";
	elif [[ "$path" == "$HOME/Videos"* ]]; then
		path="${path/"$HOME/Videos"/📼}";
	elif [[ "$path" == "$HOME"* ]]; then
		path="${path/"$HOME"/🏠}";
	elif [[ "$path" == "/opt/lycheejs"* ]]; then
		path="${path/"/opt/lycheejs"/🌱}";
	fi;

	local ps1_status="$code\e[01;49;39m$user@$host:$path\e[0m";

	if [[ "$git_status" != "" ]]; then
		echo -e "\n${ps1_status} ${git_status}\n💻 ";
	else
		echo -e "\n${ps1_status}\n💻 ";
	fi;

}

PS1='$(__my_ps1)';



#
# Archive Unpacker
# Usage: unpack </path/to/file>
#

unpack() {

	if [ -f $1 ] ; then

		case $1 in
			*.tar.bz2)   tar --one-top-level -xjf $1 ;;
			*.tar.gz)    tar --one-top-level -xzf $1 ;;
			*.tar.xz)    tar --one-top-level -xJf $1 ;;
			*.tar.zst)   tar --one-top-level  --zstd -xf $1 ;;
			*.bz2)       bunzip2 $1 ;;
			*.rar)       unrar x $1 ;;
			*.gz)        gunzip $1 ;;
			*.tar)       tar --one-top-level -xf $1 ;;
			*.tbz2)      tar --one-top-level -xjf $1 ;;
			*.tgz)       tar --one-top-level -xzf $1 ;;
			*.zip)       unzip $1 ;;
			*.Z)         uncompress $1 ;;
			*.7z)        7z x $1 ;;
			*)           echo "'$1' cannot be unpacked via unpack()" ;;
		esac;

	else
		echo "'$1' is not a valid file";
	fi;

}



#
# Fix Volume (of Headphones)
#

fix-volume() {

	cowin_e7="FC_58_FA_78_33_42";
	cowin_e8="FC_58_FA_39_7E_BB";
	jbl_flip="B8_F6_53_F5_29_44";

	for i in $(seq 0 100); do
		dbus-send --print-reply --system --dest=org.bluez "/org/bluez/hci0/dev_${cowin_e7}" "org.bluez.MediaControl1.VolumeUp";
		dbus-send --print-reply --system --dest=org.bluez "/org/bluez/hci0/dev_${cowin_e8}" "org.bluez.MediaControl1.VolumeUp";
		dbus-send --print-reply --system --dest=org.bluez "/org/bluez/hci0/dev_${jbl_flip}" "org.bluez.MediaControl1.VolumeUp";
	done;

}



#
# Git Server
# Usage: cd /path/to/repo && git-serve;
#

git-serve() {

	cwd=$PWD;

	if [ -d "$cwd/.git" ]; then
		git daemon --reuseaddr --verbose --base-path=$cwd --export-all --enable=receive-pack -- $cwd/.git;
	else
		git daemon --reuseaddr --verbose --base-path=$cwd --export-all --enable=receive-pack;
	fi;

}

tomp3() {
	local input="$1";
	local output="${input%.*}.mp3";
	ffmpeg -i "$input" -codec:a libmp3lame -qscale:a 0 "$output";
}

totiff() {
	local input="$1";
	local output="${input%.*}.tiff";
	gs -q -dNOPAUSE -sDEVICE=tiffg4 -sOutputFile=$output $input -c quit;
}

vimgrep() {
	local search="$1";
	local folder="$2";
	vim -o `grep -ril "$search" $folder`;
}


#
# Download Helpers
#
# cd ~/Music && youtube-mp3 http://url/to/stream;
# cd ~/Web && website-dl http://website.tld/index.html;
# cd ~/Extensions && crx-dl https://chrome.google.com/url/with/crx/id;

youtube-mp3() {
	youtube-dl --extract-audio --audio-format mp3 $1 --continue --ignore-errors;
}

youtube-opus() {
	youtube-dl --extract-audio --audio-format opus $1 --continue --ignore-errors;
}

website-dl() {
	wget --convert-links --page-requisites --html-extension --span-hosts -e robots=off $1;
}

crx-dl() {

	url="$1";
	crx=$(basename $url);
	file=$(basename "$(dirname $url)");

	ver="84.0";
	crx_url="https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&prodversion=$ver&x=id%3D$crx%26uc";

	wget -O "$file.crx" "$crx_url";

}


if [ -r /etc/profile.d/vte.sh ]; then
	source /etc/profile.d/vte.sh;
fi;


THEFUCK=`which thefuck 2> /dev/null`;

if [ "$THEFUCK" != "" ]; then
	eval $(thefuck --alias);
fi;

