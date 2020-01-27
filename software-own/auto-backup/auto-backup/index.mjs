#!/usr/bin/env node

import console   from './console.mjs';
import gnupg     from './plugin/gnupg.mjs';
import openssh   from './plugin/openssh.mjs';
import software  from './plugin/software.mjs';
import gnome     from './plugin/gnome.mjs';
import { read  } from './helper/fs.mjs';
import { HOME  } from './helper/sh.mjs';
import { queue } from './helper/io.mjs';



const DATABASE = {};
const FLAGS    = Array.from(process.argv).slice(2).filter((v) => v.startsWith('--')).map((v) => v.substr(2));
const HOSTNAME = read('/etc/hostname').trim();
const ACTIONS  = Array.from(process.argv).slice(2).filter((v) => v.startsWith('--') === false);
const PLUGINS  = [];



let action  = ACTIONS.shift();
let plugins = ACTIONS.slice();

if (plugins.length > 0) {

	if (plugins.includes('gnome')) {
		PLUGINS.push(gnome);
	}
	if (plugins.includes('gnupg')) {
		PLUGINS.push(gnupg);
	}

	if (plugins.includes('openssh')) {
		PLUGINS.push(openssh);
	}

	if (plugins.includes('software')) {
		PLUGINS.push(software);
	}

} else {

	plugins.push('gnome');
	plugins.push('gnupg');
	plugins.push('openssh');
	plugins.push('software');

	PLUGINS.push(gnome);
	PLUGINS.push(gnupg);
	PLUGINS.push(openssh);
	PLUGINS.push(software);

}



const start = (mode) => {

	console.log('');
	console.log('auto-backup: collecting ...');
	console.log('');

	queue(PLUGINS.map((plugin) => plugin.collect), [ mode, DATABASE ], (results) => {

		let errors = [];
		let names  = [];
		let tasks  = [];

		results.forEach((result, r) => {

			if (result === true) {

				PLUGINS[r].details(mode, DATABASE);
				names.push(plugins[r]);
				tasks.push(PLUGINS[r].execute);

			} else if (result !== false) {
				errors.push(r);
			}

		});

		if (tasks.length > 0) {

			console.log('');
			console.log('auto-backup: executing ...');
			console.log('');

			queue(tasks, [ mode, DATABASE ], (results) => {

				results.forEach((result, r) => {

					if (result === true) {
						console.info(names[r] + ': success');
					} else {
						console.error(names[r] + ': failure');
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


if (action === 'help' || action === undefined) {

	console.log('');
	console.info('auto-backup');
	console.log('');
	console.log('Usage: auto-backup [Action] [Plugin...]');
	console.log('');
	console.log('Usage Notes:');
	console.log('');
	console.log('    Backups are stored in "~/Backup".');
	console.log('    Uses all plugins if none given.  ');
	console.log('');
	console.log('');
	console.log('Available Actions:');
	console.log('');
	console.log('    backup       Backup data to "~/Backup".   ');
	console.log('    restore      Restore data from "~/Backup".');
	console.log('');
	console.log('Available Plugins:');
	console.log('');
	console.log('    gnome        gnome-keyrings integration                  ');
	console.log('    gnupg        gnupg secret keys integration               ');
	console.log('    openssh      ssh secret keys integration                 ');
	console.log('    software     git repositories in "~/Software" integration');
	console.log('');

} else if (action === 'backup') {

	console.info('auto-backup: backup mode');

	start('backup');

} else if (action === 'restore') {

	console.info('auto-backup: restore mode');

	start('restore');

}

