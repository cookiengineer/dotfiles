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

export PATH="/home/$USER/go/bin:/home/$USER/.cargo/bin:$PATH";
xhost +local:root > /dev/null 2>&1;
complete -cf sudo;



#
# Default Programs and Aliases
#

export XDG_DATA_HOME="${HOME}/.local/share";
export XDG_STATE_HOME="${HOME}/.local/state";
export XDG_CACHE_HOME="${HOME}/.cache";
export XDG_CONFIG_HOME="${HOME}/.config";

export _JAVA_OPTIONS="-Djava.util.prefs.userRoot=\"${XDG_CONFIG_HOME}\"/java";
export NPM_CONFIG_USERCONFIG="${XDG_CONFIG_HOME}/npm/npmrc";

export GNUPG_HOME="${XDG_DATA_HOME}/gnupg";
export ANDROID_HOME="${XDG_DATA_HOME}/android";
export HISTFILE="${XDG_STATE_HOME}/bash/history";
export LESSHISTFILE="${XDG_STATE_HOME}/less/history";


export BROWSER=/usr/bin/chromium;
export EDITOR=/usr/bin/vim;
#export PAGER=/usr/bin/vimpager;


alias copy="xclip -sel c <";
#alias less="$PAGER";
alias more=less;                     # cmd compatibility

alias cls="clear; printf '\033[3J'"; # clear screen and scroll buffer
alias cp="cp -i";                    # confirm before overwriting something
alias dd="sudo dd bs=4M conv=fsync oflag=direct status=progress";
alias df='df -h';                    # human-readable sizes
alias egrep='egrep --colour=auto';
alias fgrep='fgrep --colour=auto';
alias free='free -m';                # show sizes in MB
alias grep='grep --colour=auto';
alias ls='ls --color=auto';
alias mv="mv -i";                    # confirm before overwriting something
alias ns='netstat -tup --wide';      # show only active program sockets
alias rm="rm -i";                    # confirm before removing something
alias wget="wget --hsts-file=${HOME}/.config/wget/hosts";



#
# Terminal-Specific Hacks
#

case ${TERM} in
	xterm*|rxvt*|Eterm*|aterm|kterm|gnome*|interix|konsole*)
		PROMPT_COMMAND='echo -ne "\033]0;${USER}@${HOSTNAME%%.*}:${PWD/#${HOME}/\~}\007"';
		;;
	screen*)
		PROMPT_COMMAND='echo -ne "\033_${USER}@${HOSTNAME%%.*}:${PWD/#${HOME}/\~}\033\\"';
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

__legacy_ps1() {

	local last_status="$?";
	local code="";
	local user="$USER";
	local host="$HOSTNAME";
	local path="$PWD";

	if [[ "$last_status" == "0" ]]; then
		code="";
	elif [[ "$last_status" == "2" ]]; then
		code="? ";
	else
		code="! ";
	fi;


	local git_status="";

	if [[ "$path" == "/home/$user/Software/tholian-network/detective-cache"* ]]; then

		git_status="";

	elif [[ "$path" == "/home/$user/Software/tholian-network/detective/cache"* ]]; then

		git_status="";

	elif [[ "$path" == "/home/$user/Software/tholian-network/endpoint-insights"* ]]; then

		git_status="";

	elif [[ "$path" == "/home/$user/Software/tholian-network/endpoint/source/insights"* ]]; then

		git_status="";

	elif [[ "$path" == "/home/$user/Software/tholian-network/oversight/profile"* ]]; then

		git_status="";

	else

		local git_dir="$(git rev-parse --git-dir 2>/dev/null)";

		if [[ "$git_dir" != "" ]]; then

			local git_ref="$(cat $git_dir/HEAD)";
			local git_branch="${git_ref##"ref: refs/heads/"}";
			local has_changes=$(git status --short 2>/dev/null);

			if [[ "$git_branch" != "" ]]; then
				git_status="($git_branch)";
			fi;

			if [[ "$has_changes" != "" ]]; then
				git_status="$git_status (changed)";
			fi;

		fi;

	fi;


	if [[ "$path" == "${HOME}/Backup"* ]]; then

		if [[ $(stat --format "%F" "${HOME}/Backup") == "symbolic link" ]]; then
			path="${path/"${HOME}/Backup"/"~/Backup"}";
		else
			path="${path/"${HOME}/Backup"/"~/Backup"}";
		fi;

	elif [[ "$path" == "${HOME}/Documents"* ]]; then
		path="${path/"${HOME}/Documents"/"~/Documents"}";
	elif [[ "$path" == "${HOME}/Downloads"* ]]; then
		path="${path/"${HOME}/Downloads"/"~/Downloads"}";
	elif [[ "$path" == "${HOME}/Games"* ]]; then
		path="${path/"${HOME}/Games"/"~/Games"}";
	elif [[ "$path" == "${HOME}/Music"* ]]; then
		path="${path/"${HOME}/Music"/"~/Music"}";
	elif [[ "$path" == "${HOME}/Packages"* ]]; then
		path="${path/"${HOME}/Packages"/"~/Packages"}";
	elif [[ "$path" == "${HOME}/Pictures"* ]]; then
		path="${path/"${HOME}/Pictures"/"~/Pictures"}";
	elif [[ "$path" == "${HOME}/Software"* ]]; then
		path="${path/"${HOME}/Software"/"~/Software"}";
	elif [[ "$path" == "${HOME}/Videos"* ]]; then
		path="${path/"${HOME}/Videos"/"~/Videos"}";
	elif [[ "$path" == "${HOME}"* ]]; then
		path="${path/"${HOME}"/"~"}";
	fi;

	local ps1_status="$code\e[01;49;39m$user@$host:$path\e[0m";

	if [[ "$git_status" != "" ]]; then
		echo -e "\n${ps1_status} ${git_status}\n> ";
	else
		echo -e "\n${ps1_status}\n> ";
	fi;

}

__modern_ps1() {

	local last_status="$?";
	local code="";
	local user="$USER";
	local host="$HOSTNAME";
	local path="$PWD";

	if [[ "$last_status" == "0" ]]; then
		code="";
	elif [[ "$last_status" == "2" ]]; then
		code="🔥 ";
	else
		code="❌ ";
	fi;


	local git_status="";

	if [[ "$path" == "/home/$user/Software/tholian-network/detective-cache"* ]]; then

		git_status="";

	elif [[ "$path" == "/home/$user/Software/tholian-network/detective/cache"* ]]; then

		git_status="";

	elif [[ "$path" == "/home/$user/Software/tholian-network/endpoint-insights"* ]]; then

		git_status="";

	elif [[ "$path" == "/home/$user/Software/tholian-network/endpoint/source/insights"* ]]; then

		git_status="";

	elif [[ "$path" == "/home/$user/Software/tholian-network/oversight/profile"* ]]; then

		git_status="";

	else

		local git_dir="$(git rev-parse --git-dir 2>/dev/null)";

		if [[ "$git_dir" != "" ]]; then

			local git_ref="$(cat $git_dir/HEAD)";
			local git_branch="${git_ref##"ref: refs/heads/"}";
			local has_changes=$(git status --short 2>/dev/null);

			if [[ "$git_branch" != "" ]]; then
				git_status="🔗 $git_branch";
			fi;

			if [[ "$has_changes" != "" ]]; then
				git_status="$git_status 🚨";
			fi;

		fi;

	fi;


	if [[ "$user" == "cookiengineer" ]]; then
		user="🍪🔧";
	elif [[ "$user" == "root" ]]; then
		user="🤖";
	fi;

	if [[ "$host" == "jarvis" ]]; then
		host="🤖";
	elif [[ "$host" == "berry" ]]; then
		host="🍓";
	elif [[ "$host" == "fury" ]]; then
		host="👿";
	elif [[ "$host" == "nuccy" ]]; then
		host="🖥️";
	elif [[ "$host" == "piney" ]]; then
		host="🌲";
	elif [[ "$host" == "ryzzy" ]]; then
		host="🚀";
	elif [[ "$host" == "tinky" ]]; then
		host="💻";
	elif [[ "$host" == "weep" ]]; then
		host="🖥️";
	fi;

	if [[ "$path" == "${HOME}/Backup"* ]]; then

		if [[ $(stat --format "%F" "${HOME}/Backup") == "symbolic link" ]]; then
			path="${path/"${HOME}/Backup"/📀}";
		else
			path="${path/"${HOME}/Backup"/💿}";
		fi;

	elif [[ "$path" == "${HOME}/Documents"* ]]; then
		path="${path/"${HOME}/Documents"/📑}";
	elif [[ "$path" == "${HOME}/Downloads"* ]]; then
		path="${path/"${HOME}/Downloads"/⛔}";
	elif [[ "$path" == "${HOME}/Games"* ]]; then
		path="${path/"${HOME}/Games"/🎮}";
	elif [[ "$path" == "${HOME}/Music"* ]]; then
		path="${path/"${HOME}/Music"/🎵}";
	elif [[ "$path" == "${HOME}/Packages"* ]]; then
		path="${path/"${HOME}/Packages"/📦}";
	elif [[ "$path" == "${HOME}/Pictures"* ]]; then
		path="${path/"${HOME}/Pictures"/📷}";
	elif [[ "$path" == "${HOME}/Software"* ]]; then
		path="${path/"${HOME}/Software"/🚧}";
	elif [[ "$path" == "${HOME}/Videos"* ]]; then
		path="${path/"${HOME}/Videos"/📼}";
	elif [[ "$path" == "${HOME}"* ]]; then
		path="${path/"${HOME}"/🏠}";
	fi;

	local ps1_status="$code\e[01;49;39m$user@$host:$path\e[0m";

	if [[ "$git_status" != "" ]]; then
		echo -e "\n${ps1_status} ${git_status}\n> ";
	else
		echo -e "\n${ps1_status}\n> ";
	fi;

}

if [[ "$TERM" == "xterm-kitty" ]]; then

	PS1='$(__modern_ps1)';

elif [[ "$TERM" == "xterm" ]]; then

	if [[ "$DISPLAY" != "" ]]; then
		xrdb -merge ~/.Xresources;
	fi;

	PS1='$(__legacy_ps1)';

fi;



#
# Archive Unpacker
# Usage: unpack </path/to/file>
#

unpack() {

	if [ -f $1 ] ; then

		case $1 in
			*.crx)       uncrx $1 ;;
			*.deb)       ar xv $1 ;;
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
			*.xz)        unxz -d $1 ;;
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

	cowin_e7="FC_58_FA_9C_01_0B";
	cowin_e8="FC_58_FA_39_7E_BB";
	jbl_flip="B8_F6_53_F5_29_44";

	for i in $(seq 0 100); do
		dbus-send --print-reply --system --dest=org.bluez "/org/bluez/hci0/dev_${cowin_e7}" "org.bluez.MediaControl1.VolumeUp" 2> /dev/null;
		dbus-send --print-reply --system --dest=org.bluez "/org/bluez/hci0/dev_${cowin_e8}" "org.bluez.MediaControl1.VolumeUp" 2> /dev/null;
		dbus-send --print-reply --system --dest=org.bluez "/org/bluez/hci0/dev_${jbl_flip}" "org.bluez.MediaControl1.VolumeUp" 2> /dev/null;
	done;

	sinks=`pacmd list-sinks`;

	if [[ "$sinks" == *"$cowin_e7"* ]]; then
		pacmd set-default-sink 1;
		sed -i "s|\"pulse:bluez_sink.*.a2dp_sink\"|\"pulse:bluez_sink.${cowin_e7}.a2dp_sink\"|g" .config/i3status/config;
		i3-msg restart;
	elif [[ "$sinks" == *"$cowin_e8"* ]]; then
		pacmd set-default-sink 1;
		sed -i "s|\"pulse:bluez_sink.*.a2dp_sink\"|\"pulse:bluez_sink.${cowin_e8}.a2dp_sink\"|g" .config/i3status/config;
		i3-msg restart;
	elif [[ "$sinks" == *"$jbl_flip"* ]]; then
		pacmd set-default-sink 1;
		sed -i "s|\"pulse:bluez_sink.*.a2dp_sink\"|\"pulse:bluez_sink.${jbl_flip}.a2dp_sink\"|g" .config/i3status/config;
		i3-msg restart;
	else
		pacmd set-default-sink 0;
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

to720p() {
	local input="$1";
	local output="${input%.*}-720p.avi";
	local x264params="cabac=1:ref=5:analyse=0x133:me=umh:subme=9:chroma-me=1:deadzone-inter=21:deadzone-intra=11:b-adapt=2:rc-lookahead=60:vbv-maxrate=10000:vbv-bufsize=10000:qpmax=69:bframes=5:b-adapt=2:direct=auto:crf-max=51:weightp=2:merange=24:chroma-qp-offset=-1:sync-lookahead=2:psy-rd=1.00,0.15:trellis=2:min-keyint=23:partitions=all";
	ffmpeg -i "$input" -vf scale=-1:720 -c:v libx264 -crf 18 -x264-params "${x264params}" -c:a aac -ar 44100 -b:a 128k -map 0 "${output}";
}

to1080p() {
	local input="$1";
	local output="${input%.*}-1080p.avi";
	local x264params="cabac=1:ref=5:analyse=0x133:me=umh:subme=9:chroma-me=1:deadzone-inter=21:deadzone-intra=11:b-adapt=2:rc-lookahead=60:vbv-maxrate=10000:vbv-bufsize=10000:qpmax=69:bframes=5:b-adapt=2:direct=auto:crf-max=51:weightp=2:merange=24:chroma-qp-offset=-1:sync-lookahead=2:psy-rd=1.00,0.15:trellis=2:min-keyint=23:partitions=all";
	ffmpeg -i "$input" -vf scale=-1:1080 -c:v libx264 -crf 18 -x264-params "${x264params}" -c:a aac -ar 44100 -b:a 128k -map 0 "${output}";
}

tomp3() {
	local input="$1";
	local output="${input%.*}.mp3";
	ffmpeg -i "$input" -codec:a libmp3lame -qscale:a 0 "$output";
}

tomp4() {
	local input="$1";
	local output="${input%.*}.mp4";
	ffmpeg -i "$input" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "$output";
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

datetime() {

	date="$1";
	time="$2";

	if [[ "$date" != "" ]] && [[ $date =~ ^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$ ]]; then

		if [[ "$time" != "" ]] && [[ $time =~ ^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$ ]]; then
			sudo date +"%F %T" -s "$date $time";
		else
			sudo date +"%F" -s "$date";
		fi;

	else
		sudo ntpdate de.pool.ntp.org;
	fi;

}

screenshot() {

	export DISPLAY=":0";
	export XAUTHORITY="/home/cookiengineer/.Xauthority";
	scrot -b '%Y-%m-%d_%H:%M:%S.png';

}

youtube-dl() {
	yt-dlp -v -S 'res:1080' -o "%(playlist_index)s-%(title)s.%(ext)s" $1;
}

youtube-mp3() {
	# youtube-dl --extract-audio --audio-format mp3 $1 --continue --ignore-errors;
	yt-dlp -f 'ba' -x --audio-format mp3 $1;
}

youtube-mp4() {
	yt-dlp -S res,ext:mp4:m4a --recode mp4 $1;
}

youtube-opus() {
	# youtube-dl --extract-audio --audio-format opus $1 --continue --ignore-errors;
	yt-dlp -f 'ba' -x --audio-format opus $1;
}

website-dl() {
	wget --convert-links --page-requisites --html-extension --span-hosts -e robots=off $1;
}

crx-dl() {

	url="$1";
	crx=$(basename $url);
	file=$(basename "$(dirname $url)");

	ver="100.0";
	crx_url="https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&prodversion=$ver&x=id%3D$crx%26uc";

	wget -O "$file.crx" "$crx_url";

}


if [ -r /etc/profile.d/vte.sh ]; then
	source /etc/profile.d/vte.sh;
fi;


THEFUCK=`which thefuck 2> /dev/null`;

if [[ "$THEFUCK" != "" ]]; then
	eval $(thefuck --alias);
fi;

