
# Barrier GUI

- Shipped binary embeds barrier-server and barrier-client packages
- GUI webview
- select server/client mode
- start/stop barrier service
- discovery of connected machines via multicast DNS
- arrangement of monitors (very painful with config)
- config generation
- systemd user service generation and installation


# gogoproxy

- HTTP/S and DNS Proxy, which intercepts requests and archives them
- Intercept ads and overlays, and filter out HTML and CSS into the "good parts" (e.g. without `overflow:hidden` or `height:100vh`)
- Standalone GUI, with web frontend to select domains that should be archived.
- Autonomous SSL certificate generation and installation to `/etc/ca-certificates`


# Cyber Defense Games

- CTF, but for real
- Rules of engagement with real software/webservers
- Predefined flags.txt paths, e.g. `/root/flag.txt` or `/home/$USER/flag.txt`
- Blueteam vs Redteam engagement
- apache, nginx
- mysql, postgres
- wordpress, openssh, nodejs(?)


# Mobile Redirector Extension

- Redirect services to no-JavaScript-using ones (e.g. twitter to nitter instances)
- Remove JavaScript nagging popups, and make websites more mobile friendly via filters


# Multitask Browser Extension

Task Planner Overview that integrates tasks with `Agenda`, divided into overdue
tasks, scheduled tasks, unscheduled tasks and a task backlog.

- GitHub issues (multiple repositories)
- GitLab issues (multiple repositories)
- Calendar sharing
- Invites
- Daily Reports
- Team Calendars


# Better Save Browser Extension

Saving Media in the Browser sucks, and `Ctrl` + `S` could be much better.

- Imgur Videos
- Instagram Stories and Posts
- Facebook Stories, Photos and Posts
- Reddit Posts


# Open Dot Software Website

- Discovery of Open Source Projects
- Web Extension to scrape GitHub/GitLab/Gitea Stars and usage metrics


# Quick Command Browser Extension

Implement an `Alt` + `Space` dialog that allows to command the Browser to
do automated actions.

- Open/Close Tab
- Create Tab
- Open URL
- Save detected Media


# Tracktor Project

Show whether or not a Browser is trackable, by using Canvas Fingerprinting,
JavaScript API Fingerprinting and Network Behaviour Fingerprinting.

- SSL Fingerprinting
- Network Request Fingerprinting (Order, Delay, Duration)
- CSS Fingerprinting via `@supports`

