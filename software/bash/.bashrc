#
# ~/.bashrc
#
# XXX: COOKIENGINEERS BASHRC
#

[[ $- != *i* ]] && return

if [ -r /usr/share/git/git-prompt.sh ]; then
	source /usr/share/git/git-prompt.sh;
fi;

if [ -r /etc/profile.d/vte.sh ]; then
	source /etc/profile.d/vte.sh;
fi;

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

	__my_ps1() {

		last_status="$?";
		str="\n[";

		if [ "$last_status" == "0" ]; then
			str=$str"\e[32m✔\e[0m";
		else
			str=$str"\e[31m✘\e[0m";
		fi;

		str="$str]─[";
		str=$str"\e[01;49;39m$USER@$HOSTNAME\e[0m";
		str="$str]─[";
		str=$str"\e[01;49;39m$PWD\e[0m";

		git_status="$(__git_ps1 "%s")";
		if [ "$git_status" != "" ]; then
			str="$str]─[";
			str=$str"\e[01;49;39m${git_status}\e[0m";
		fi;

		str="$str]\n[$]";

		echo -e "$str ";

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



#
# Youtube-DL Helpers
# Usage: cd ~/Music && youtube-dl http://url/to/stream;
#

youtube-mp3() {
	youtube-dl --extract-audio --audio-format mp3 $1 --continue;
}

youtube-opus() {
	youtube-dl --extract-audio --audio-format opus $1 --continue;
}

