
# Raspberry Zero Game Undercover Pentest Device

- Raspberry Zero with HATs for LAN and USB, made for pentesting
- Waveshare Game HAT to launch modified RetroPie by default
- [Game HAT Case](https://www.thingiverse.com/thing:3267519)
- [Waveshare Game HAT](https://www.waveshare.com/game-hat.htm)
- [Bashbunny Payloads](https://github.com/hak5/bashbunny-payloads)

# Go Zim Scraper

- Most ZIM Scrapers are either outdated or require a huge load of dependencies.
- A scraper that supports search in web archive to export from web archive to zim would be even better.
- [waybackurls](https://github.com/tomnomnom/waybackurls) scrapes the indexes for a domain or subdomain
- [wayback-machine-downloader](https://github.com/hartator/wayback-machine-downloader) downloads from wayback machine
- [gozim](https://github.com/akhenakh/gozim) is a pure go implementation of the ZIM format

# Go Web Browser

- Privacy-respecting Web Browser that actively transforms all JS, CSS, and HTML and
  filters out the bad parts and replaces them with farbled/faked calls and datasets.
- The most ahead JS engine is currently Sobek, a fork of Goja (which is sadly a bit inactive)
- Goja/Sobek need an external event loop, but are made for multiple runtime isolations,
  so each goroutine / thread could use a separate VM instance
- [sobek](https://github.com/grafana/sobek) is the new upstream fork
- [goja_nodejs](https://github.com/dop251/goja_nodejs) already implements an event loop
- [goja](https://github.com/dop251/goja) is the downstream fork (that has maintenance problems for ES modules)

# Enigma Webfont

- Combat LLMs by using randomized seeds for you content
- Use a Webfont that "unshuffles" the `ROTXX` rotated alphabet on the current page
- Use an Enigma Captcha slider to effectively ban bots, where the slider "decrypts" a sample text
- For worse behaving users, use multiple rotations like Enigma

# Warps

- An instant messenger made for the creation of network groups
- GUI that allows to invite friends into your network for LAN parties
- Management of /24 or other prefixes
- Management of public/private crypto key pairs, people need to confirm
  the friend's key when they join
- Wireguard behind the scenes?
- Pro version could be software routing/switching of multiple networks

# Watchdaemon for sandboxed end-user VMs

- A watchdaemon for untrusted (external) freelance workers that work on classified projects.
- Use Docker and RDP to sandbox a VM, only RDP access is allowed
- Observe Copy/Paste
- Observe keystrokes via eBPF keylogger
- Timeline UI of Coding, Browsing, Pushing Time
- Log of browsed websites (and DNS requests)
- Log of Copy/Paste interactions
- Forbid connections to DNS over TLS/HTTPS servers
- Generate/Intercept TLS certificates automatically


# WhatsApp Form Provider

- A lot of people rely on WhatsApp for communication
- Form that posts entries/contact requests just via WhatsApp bot
- Create a Web Form UI that can flexibly build forms online through a mobile website


# Forensics Tools / Binmap

- Draw a map of an executable and its library dependencies and plot them on an SVG chart
- Additionally support a `--functions` flag that also plots functions from other libraries
- Categorize functions and node clusters by filename and/or folder paths


# Go Shell

- [ ] [BubbleTea](https://github.com/charmbracelet/bubbletea) based Terminal UI for an interactive Shell in Golang.
- [ ] [Yeagi/interp](https://github.com/traefik/yaegi) based Interpreter, but with additional standard package.
- [ ] `gosh` standard package to interact with shell in an easier way (e.g. `gosh.Mkdir() bool`)


# SMART GUI

- [ ] GUI for `smartctl` and smartmontools, to check external HDDs automatically
      or in an easier manner.


# SystmD GUI

- Build a UI that shows services and sandboxing configurations of systemd units and services
- Remote UI can be implemented using SSH tunnels to a remote server, where the queries are executed
- Allow to enable sandboxing features (e.g. seccomp based sandboxes) and other things


# Wallet GUI

- [ ] Parse CSVs of bank account into a wallet that auto-tags things based on identifying
      strings for subjects, receiver, sender etc.


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

- HTTP/S and DNS Proxy, which intercepts requests and archives them.
- Intercept ads and overlays, and filter out HTML and CSS into the "good parts" (e.g. without `overflow:hidden` or `height:100vh`)
- [goja](https://github.com/dop251/goja) JavaScript VM to filter out the "bad parts" of tracker codes.
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

