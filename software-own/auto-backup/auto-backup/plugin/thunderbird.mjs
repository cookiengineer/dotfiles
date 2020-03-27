
import { console            } from '../console.mjs';
import { exists             } from '../helper/fs.mjs';
import { read               } from '../helper/ini.mjs';
import { BACKUP, HOME, HOST } from '../helper/sh.mjs';



const _collect = (mode, database, callback) => {

	database['thunderbird'] = [];


	if (mode === 'backup') {

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

							database['thunderbird'].push({
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

	} else if (mode === 'restore') {

		// TODO
		callback(false);

	}

};

const _details = (mode, database) => {

	database['thunderbird'] = database['thunderbird'] || [];


	if (mode === 'backup') {

		if (database['thunderbird'].length > 0) {
			database['thunderbird'].forEach((entry) => {
				console.info('thunderbird: ' + entry.name + ' (' + entry.origin + ')');
			});
		}

	} else if (mode === 'restore') {

		if (database['thunderbird'].length > 0) {
			database['thunderbird'].forEach((entry) => {
				console.info('thunderbird: ' + entry.name + ' (' + entry.origin + ')');
			});
		}

	}

};

const _execute = (mode, database, callback) => {

	database['thunderbird'] = database['thunderbird'] || [];


	if (mode === 'backup') {

		if (database['thunderbird'].length > 0) {

			database['thunderbird'].forEach((profile) => {

				console.log(profile);

				// TODO: use master password set in key4.db file
				// TODO: decrypt logins.json using ASN1 and Triple-DES

				console.log(profile);

			});

		} else {

			callback(false);

		}

	} else if (mode === 'restore') {

		// TODO:
		callback(false);

	}

};



export default {

	name:    'thunderbird',

	collect: _collect,
	details: _details,
	execute: _execute

};

