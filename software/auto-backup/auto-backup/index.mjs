#!/usr/bin/env node

import console        from './console.mjs';
import { isFunction } from './POLYFILLS.mjs';
import { queue      } from './helper/io.mjs';

import authenticator from './plugin/gnome-authenticator.mjs';
import chromium      from './plugin/chromium.mjs';
import gnupg         from './plugin/gnupg.mjs';
import keepass       from './plugin/keepass.mjs';
import music         from './plugin/music.mjs';
import nautilus      from './plugin/gnome-nautilus.mjs';
import openssh       from './plugin/openssh.mjs';
import software      from './plugin/software.mjs';
// import stealth       from './plugin/stealth.mjs';
import thunderbird   from './plugin/thunderbird.mjs';



const ACTION  = Array.from(process.argv).slice(2).filter((v) => v.startsWith('--') === false)[0] || null;
const PLUGINS = Array.from(process.argv).slice(2).filter((v) => v.startsWith('--') === false).slice(1);

const DATABASE = {
	'chromium':            [],
	'gnome-authenticator': [],
	'gnome-nautilus':      [],
	'gnupg':               [],
	'keepass':             [],
	'music':               [],
	'openssh':             [],
	'software':            [],
	'stealth':             [],
	'thunderbird':         []
};

const MAP = {
	'chromium':            chromium,
	'gnome-authenticator': authenticator,
	'gnome-nautilus':      nautilus,
	'gnupg':               gnupg,
	'keepass':             keepass,
	'music':               music,
	'openssh':             openssh,
	'software':            software,
	'stealth':             null,
	'thunderbird':         thunderbird
};

if (PLUGINS.length === 0) {

	Object.keys(MAP).forEach((plugin) => {

		if (MAP[plugin] !== null) {
			PLUGINS.push(plugin);
		}

	});

}



const start = (mode, plugins) => {

	console.log('');
	console.log('auto-backup: collecting ...');
	console.log('');

	queue(plugins.map((plugin) => plugin[mode].collect), plugins.map((plugin) => DATABASE[plugin.name]), (results) => {

		let errors    = [];
		let collected = [];

		results.forEach((result, r) => {

			if (result === true) {

				let plugin = plugins[r] || null;
				if (plugin !== null) {

					if (isFunction(plugin[mode].details) === true) {

						plugin[mode].details(DATABASE[plugin.name]);

					} else {

						DATABASE[plugin.name].forEach((entry) => {
							console.info(plugin.name + ': ' + entry.name);
						});

					}

					collected.push(plugin);

				}

			} else if (result !== false) {
				errors.push(r);
			}

		});

		if (collected.length > 0) {

			console.log('');
			console.log('auto-backup: executing ...');
			console.log('');

			queue(collected.map((plugin) => plugin[mode].execute), collected.map((plugin) => DATABASE[plugin.name]), (results) => {

				results.forEach((result, r) => {

					if (result === true) {
						console.info(collected[r].name + ': success');
					} else {
						console.error(collected[r].name + ': failure');
					}

				});

				console.info('auto-backup: Done 😎.');

				process.exit(0);

			});


		} else if (errors.length > 0) {

			errors.map((e) => plugins[e]).forEach((plugin) => {
				console.error(plugin.name + ': failure');
			});

			console.error('auto-backup: Errors occured 😠.');

			process.exit(1);

		} else if (errors.length === 0) {

			console.info('auto-backup: Nothing to do 😴.');

			process.exit(0);

		}

	});

};


if (ACTION === 'init') {

	console.info('auto-backup: init mode');
	console.warn('auto-backup: Careful! This requires an internet connection ...');

	start('init', Object.keys(MAP).filter((name) => {
		return PLUGINS.includes(name);
	}).map((name) => {
		return MAP[name];
	}));

} else if (ACTION === 'backup') {

	console.info('auto-backup: backup mode');

	start('backup', Object.keys(MAP).filter((name) => {
		return PLUGINS.includes(name);
	}).map((name) => {
		return MAP[name];
	}));

} else if (ACTION === 'restore') {

	console.info('auto-backup: restore mode');

	start('restore', Object.keys(MAP).filter((name) => {
		return PLUGINS.includes(name);
	}).map((name) => {
		return MAP[name];
	}));

} else {

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
	console.log('    init         Initialize all profiles if not existing.');
	console.log('    backup       Backup data to "~/Backup".              ');
	console.log('    restore      Restore data from "~/Backup".           ');
	console.log('');
	console.log('Available Plugins:');
	console.log('');
	console.log('    chromium               Chromium passwords integration   ');
	console.log('    gnome-authenticator    GNOME Authenticator integration  ');
	console.log('    gnome-nautilus         GNOME Nautilus integration       ');
	console.log('    gnupg                  GnuPG secret keys integration    ');
	console.log('    keepass                KeePass(XC) databases integration');
	console.log('    openssh                OpenSSH secret keys integration  ');
	console.log('');
	console.log('    music                  "~/Music" integration            ');
	console.log('    software               "~/Software" integration         ');
	console.log('    stealth                "~/Stealth" integration          ');
	console.log('    thunderbird            Thunderbird integration          ');
	console.log('');

	process.exit(1);

}

