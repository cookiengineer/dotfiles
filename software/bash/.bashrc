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
# XXX: Only override PS1 if git is installed
#

if [ -r /usr/share/git/git-prompt.sh ]; then

	source /usr/share/git/git-prompt.sh;

	__my_ps1() {

		local last_status="$?";
		local code="";
		local git_status="$(__git_ps1 "%s")";
		local user="$USER";
		local host="$HOSTNAME";
		local path="$PWD";

		if [ "$last_status" == "0" ]; then
			code="✔️ ";
		elif [ "$last_status" == "2" ]; then
			code="🔥";
		else
			code="❌";
		fi;

		if [ "$user" == "cookiengineer" ]; then
			user="🍪🔧";
		elif [ "$user" == "root" ]; then
			user="🤖";
		fi;

		if [ "$host" == "weep" ]; then
			host="🖥️ ";
		elif [ "$host" == "tinky" ]; then
			host="💻";
		fi;

		if [ "$path" == "$HOME" ]; then
			path="🏠";
		elif [ "$path" == "/opt/lycheejs" ]; then
			path="🌱";
		fi;

		local str="$code \e[01;49;39m$user@$host:$path\e[0m";

		if [ "$git_status" != "" ]; then
			echo -e "\n$str 🛰️  \e[01;49;39m${git_status}\e[0m 🛰️  \n💻 ";
		else
			echo -e "\n$str\n💻 ";
		fi;

	}

	PS1='$(__my_ps1)';

else

	__my_ps1() {

		local last_status="$?";
		local code="";
		local user="$USER";
		local host="$HOSTNAME";
		local path="$PWD";

		if [ "$last_status" == "0" ]; then
			code="✔️ ";
		elif [ "$last_status" == "2" ]; then
			code="🔥";
		else
			code="❌";
		fi;

		if [ "$user" == "cookiengineer" ]; then
			user="🍪🔧";
		elif [ "$user" == "root" ]; then
			user="🤖";
		fi;

		if [ "$host" == "weep" ]; then
			host="🖥️ ";
		elif [ "$host" == "tinky" ]; then
			host="💻";
		fi;

		if [ "$path" == "$HOME" ]; then
			path="🏠";
		elif [ "$path" == "/opt/lycheejs" ]; then
			path="🌱";
		fi;

		echo -e "\n$code \e[01;49;39m$user@$host:$path\e[0m\n💻 ";

	}

	PS1='$(__my_ps1)';

fi;



#
# Archive Extractor
# Usage: ex </path/to/file>
#

ex() {

  if [ -f $1 ] ; then

    case $1 in
      *.tar.bz2)   tar xjf $1   ;;
      *.tar.gz)    tar xzf $1   ;;
      *.bz2)       bunzip2 $1   ;;
      *.rar)       unrar x $1   ;;
      *.gz)        gunzip $1    ;;
      *.tar)       tar xf $1    ;;
      *.tbz2)      tar xjf $1   ;;
      *.tgz)       tar xzf $1   ;;
      *.zip)       unzip $1     ;;
      *.Z)         uncompress $1;;
      *.7z)        7z x $1      ;;
      *)           echo "'$1' cannot be extracted via ex()" ;;
    esac;

  else
    echo "'$1' is not a valid file";
  fi;

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

	ver="74.0";
	crx_url="https://clients2.google.com/service/update2/crx?response=redirect&prodversion=$ver&x=id%3D$crx%26installsource%3Dondemand%26uc";

	wget -O "$file.crx" "$crx_url";

}


if [ -r /etc/profile.d/vte.sh ]; then
	source /etc/profile.d/vte.sh;
fi;


THEFUCK=`which thefuck 2> /dev/null`;

if [ "$THEFUCK" != "" ]; then
	eval $(thefuck --alias);
fi;

