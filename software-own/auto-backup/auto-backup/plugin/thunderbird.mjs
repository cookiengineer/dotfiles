
import { console            } from '../console.mjs';
import { exists             } from '../helper/fs.mjs';
import { read               } from '../helper/ini.mjs';
import { BACKUP, HOME, HOST } from '../helper/sh.mjs';



/*
 * Thunderbird is so old, even their own developers don't
 * know what their storage files are meant for exactly.
 *
 * This file map exists to only backup / restore the important
 * files and will lead to tracking-cookies and browser-related
 * settings being forgotten, which is intended.
 *
 * It's an email client, not a web browser, after all.
 */

const FILE_MAP = {

	'ImapMail':      'folder',
	'Mail':          'folder',
	'calendar-data': 'folder',

	'cert9.db':                     'file',
	'compatibility.ini':            'file',
	'content-prefs.sqlite':         'file',
	'directoryTree.json':           'file',
	'extension-preferences.json':   'file',
	'extensions.json':              'file',
	'folderTree.json':              'file',
	'key4.db':                      'file',
	'logins.json':                  'file',
	'panacea.dat':                  'file',
	'permissions.sqlite':           'file',
	'pkcs11.txt':                   'file',
	'prefs.js':                     'file',
	'revocations.txt':              'file',
	'SiteSecurityServiceState.txt': 'file',
	'virtualFolders.dat':           'file'

};



const PLUGIN = {

	name: 'thunderbird',

	init: {

		collect: (database, callback) => {
		},

		execute: (database, callback) => {
		}

	},

	backup: {

		collect: (database, callback) => {

			if (
				exists(HOME + '/.thunderbird', 'folder')
				&& exists(HOME + '/.thunderbird/profiles.ini', 'file')
			) {

				let config = read(HOME + '/.thunderbird/profiles.ini');
				if (config !== null) {

					let profiles = config.filter((entry) => {
						return entry['@id'].startsWith('Profile');
					});

					if (profiles.length > 0) {

						profiles.forEach((profile) => {

							let name = profile['Name'] || null;
							let path = profile['Path'] || null;

							if (name !== null && path !== null) {

								if (path.startsWith('/') === false) {
									path = HOME + '/.thunderbird/' + path;
								}

								database.push({
									backup: BACKUP + '/Profiles/' + HOST + '/thunderbird/',
									name:   name,
									origin: path
								});

							}

						});

						callback(true);

					} else {

						callback(false);

					}

				} else {

					callback(false);

				}

			} else {

				callback(false);

			}

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				database.forEach((profile) => {

					console.log(profile);

				});

			} else {

				callback(false);

			}

		}

	},

	restore: {

		collect: (database, callback) => {

			// TODO

		},

		execute: (database, callback) => {

			// TODO

		}

	}

};


export default PLUGIN;

