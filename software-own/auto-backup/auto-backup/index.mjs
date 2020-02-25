#!/usr/bin/env node

import console       from './console.mjs';
import authenticator from './plugin/gnome-authenticator.mjs';
import chromium      from './plugin/chromium.mjs';
import music         from './plugin/music.mjs';
import nautilus      from './plugin/gnome-nautilus.mjs';
import gnupg         from './plugin/gnupg.mjs';
import openssh       from './plugin/openssh.mjs';
import software      from './plugin/software.mjs';
// import stealth       from './plugin/stealth.mjs';
import { read  }     from './helper/fs.mjs';
import { HOME  }     from './helper/sh.mjs';
import { queue }     from './helper/io.mjs';



const DATABASE = {};
const FLAGS    = Array.from(process.argv).slice(2).filter((v) => v.startsWith('--')).map((v) => v.substr(2));
const HOSTNAME = read('/etc/hostname').trim();
const ACTION   = Array.from(process.argv).slice(2).filter((v) => v.startsWith('--') === false)[0] || null;
const PLUGINS  = Array.from(process.argv).slice(2).filter((v) => v.startsWith('--') === false).slice(1);

const MAP = {
	'chromium':            chromium,
	'gnome-authenticator': authenticator,
	'gnome-nautilus':      nautilus,
	'gnupg':               gnupg,
	'music':               music,
	'openssh':             openssh,
	'software':            software,
	'stealth':             null // stealth
};

if (PLUGINS.length === 0) {

	Object.keys(MAP).forEach((plugin) => {
		PLUGINS.push(plugin);
	});

}



const start = (mode, plugins) => {

	console.log('');
	console.log('auto-backup: collecting ...');
	console.log('');

	queue(plugins.map((plugin) => plugin.collect), [ mode, DATABASE ], (results) => {

		let errors    = [];
		let collected = [];

		results.forEach((result, r) => {

			if (result === true) {

				plugins[r].details(mode, DATABASE);
				collected.push(plugins[r]);

			} else if (result !== false) {
				errors.push(r);
			}

		});

		if (collected.length > 0) {

			console.log('');
			console.log('auto-backup: executing ...');
			console.log('');

			queue(collected.map((plugin) => plugin.execute), [ mode, DATABASE ], (results) => {

				results.forEach((result, r) => {

					if (result === true) {
						console.info(collected[r].name + ': success');
					} else {
						console.error(collected[r].name + ': failure');
					}

				});

			});

		} else if (errors.length > 0) {

			process.exit(1);

		} else if (errors.length === 0) {

			process.exit(0);

		}

	});

};


if (ACTION === 'help' || ACTION === null) {

	console.log('');
	console.info('auto-backup');
	console.log('');
	console.log('Usage: auto-backup [Action] [Plugin...]');
	console.log('');
	console.log('Usage Notes:');
	console.log('');
	console.log('    Backups are stored in "~/Backup".  ');
	console.log('    Executes all plugins if none given.');
	console.log('');
	console.log('');
	console.log('Available Actions:');
	console.log('');
	console.log('    backup       Backup data to "~/Backup".   ');
	console.log('    restore      Restore data from "~/Backup".');
	console.log('');
	console.log('Available Plugins:');
	console.log('');
	console.log('    chromium               Chromium passwords integration ');
	console.log('    gnome-authenticator    GNOME Authenticator integration');
	console.log('    gnome-nautilus         GNOME Nautilus integration     ');
	console.log('    gnupg                  GnuPG secret keys integration  ');
	console.log('    openssh                OpenSSH secret keys integration');
	console.log('');
	console.log('    music                  "~/Music" integration          ');
	console.log('    software               "~/Software" integration       ');
	console.log('    stealth                "~/Stealth" integration        ');
	console.log('');

} else if (ACTION === 'backup') {

	console.info('auto-backup: backup mode');

	start('backup', Object.keys(MAP).filter((name, m) => {
		return PLUGINS.includes(name);
	}).map((name) => {
		return MAP[name];
	}));

} else if (ACTION === 'restore') {

	console.info('auto-backup: restore mode');

	start('restore', Object.keys(MAP).filter((name, m) => {
		return PLUGINS.includes(name);
	}).map((name) => {
		return MAP[name];
	}));

}

