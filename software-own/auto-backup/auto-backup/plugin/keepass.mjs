
import { console                   } from '../console.mjs';
import { copy, exists, mkdir, scan } from '../helper/fs.mjs';
import { BACKUP, HOME, HOST        } from '../helper/sh.mjs';


const PLUGIN = {

	name: 'keepass',

	init: {

		collect: (database, callback) => {

			if (exists(HOME + '/Passwords.kdbx') === false) {

				PLUGIN.restore.collect(database, callback);

			} else {

				callback(false);

			}

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				PLUGIN.restore.execute(database, callback);

			} else {

				callback(false);

			}

		}

	},

	backup: {

		collect: (database, callback) => {

			if (exists(HOME + '/Passwords.kdbx')) {

				database.push({
					backup: BACKUP + '/Profiles/' + HOST + '/keepass/Passwords.kdbx',
					name:   'Passwords',
					origin: HOME + '/Passwords.kdbx',
				});

				callback(true);

			} else {

				callback(false);

			}

		},

		details: (database) => {

			if (database.length > 0) {
				database.forEach((file) => {
					console.info(PLUGIN.name + ': ' + file.name);
				});
			}

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				if (exists(BACKUP + '/Profiles/' + HOST + '/keepass') === false) {
					mkdir(BACKUP + '/Profiles/' + HOST + '/keepass');
				}

				database.forEach((file) => {
					copy(file.origin, file.backup);
				});

				callback(true);

			} else {

				callback(false);

			}

		}

	},

	restore: {

		collect: (database, callback) => {

			if (exists(BACKUP + '/Profiles/' + HOST + '/keepass')) {

				let files = scan(BACKUP + '/Profiles/' + HOST + '/keepass', false).filter((file) => {
					return file.endsWith('.kdbx');
				}).map((file) => {
					return file.substr(0, file.length - 5);
				});

				if (files.length > 0) {

					files.forEach((name) => {

						database.push({
							backup: BACKUP + '/Profiles/' + HOST + '/keepass/' + name + '.kdbx',
							name:   name,
							origin: HOME + '/' + name + '.kdbx'
						});

					});

				}

				callback(true);

			} else {

				callback(false);

			}

		},

		details: (database) => {

			if (database.length > 0) {
				database.forEach((file) => {
					console.info(PLUGIN.name + ': ' + file.name);
				});
			}

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				database.forEach((file) => {

					if (exists(file.origin) === false) {
						copy(file.backup, file.origin);
					}

				});

				callback(true);

			} else {

				callback(false);

			}

		}

	}

};


export default PLUGIN;

