
import { createDecipheriv, pbkdf2Sync } from 'crypto';

import { console                          } from '../console.mjs';
import { exists, mkdir, read, scan, write } from '../helper/fs.mjs';
import { search                           } from '../helper/secret.mjs';
import { BACKUP, HOME, HOST               } from '../helper/sh.mjs';
import { query                            } from '../helper/sqlite.mjs';



const _get_label = (user, url) => {

	if (user.includes('@')) {
		user = user.split('@').shift().trim();
	}

	if (user !== '') {
		return user + '@' + _get_service(url);
	} else {
		return _get_service(url);
	}

};

const _get_service = (url) => {

	let tmp = url;
	if (tmp.startsWith('http://') || tmp.startsWith('https://')) {
		tmp = tmp.substr(tmp.indexOf('://') + 3);
	}

	if (tmp.startsWith('www.')) {
		tmp = tmp.substr(4);
	}

	if (tmp.includes('/')) {
		tmp = tmp.split('/').shift();
	}

	if (tmp !== '') {
		return tmp;
	}

	return null;

};

const crack = (buffer, password) => {

	let head = buffer.slice(0, 3).toString('utf8');
	let hash = buffer.slice(3);

	if (head === 'v10') {

		let key      = pbkdf2Sync('peanuts', 'saltysalt', 1, 16, 'sha1');
		let iv       = Buffer.from('                ', 'utf8');
		let decipher = createDecipheriv('aes-128-cbc', key, iv);
		let result   = decipher.update(hash).toString('utf8') + decipher.final('utf8');

		if (result.trim() !== '') {
			return result;
		}

	} else if (head === 'v11') {


		let key      = pbkdf2Sync(password, 'saltysalt', 1, 16, 'sha1');
		let iv       = Buffer.from('                ', 'utf8');
		let decipher = createDecipheriv('aes-128-cbc', key, iv);
		let result   = decipher.update(hash).toString('utf8') + decipher.final('utf8');

		if (result.trim() !== '') {
			return result;
		}

	}


	return null;

};



const PLUGIN = {

	name: 'chromium',

	init: {

		collect: (database, callback) => {

			if (exists(HOME + '/.config/chromium') === false) {

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

			if (
				exists(HOME + '/.local/share/keyrings')
				&& exists(HOME + '/.config/chromium')
				&& exists(HOME + '/.config/chromium/Default')
			) {

				let master_key = search({
					'application': 'chromium'
				}).filter((entry) => {
					return entry['schema'] === 'chrome_libsecret_os_crypt_password_v2';
				})[0] || null;

				if (master_key !== null) {

					let accounts = query('SELECT origin_url as website, username_value as username, hex(password_value) as password FROM logins', HOME + '/.config/chromium/Default/Login Data');
					if (accounts.length > 0) {

						accounts.forEach((account) => {

							let label   = _get_label(account['username'], account['website']);
							let service = _get_service(account['website']);
							let secret  = crack(Buffer.from(account['password'], 'hex'), master_key.secret);

							if (label !== null && service !== null && secret !== null) {

								database.push({
									data: {
										'label':    label,
										'secret':   secret,
										'service':  service,
										'username': account['username'],
										'website':  account['website']
									},
									name: label
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

				if (exists(BACKUP + '/Profiles/' + HOST + '/chromium') === false) {
					mkdir(BACKUP + '/Profiles/' + HOST + '/chromium');
				}

				database.forEach((entry) => {

					let data = null;

					try {
						data = Buffer.from(JSON.stringify(entry.data, null, '\t'), 'utf8');
					} catch (err) {
						data = null;
					}

					if (data !== null) {
						console.log(PLUGIN.name + ': archiving ' + entry.name + ' ...');
						write(BACKUP + '/Profiles/' + HOST + '/chromium/' + entry.name + '.json', data);
					}

				});

				callback(true);

			} else {

				callback(false);

			}

		}

	},

	restore: {

		collect: (database, callback) => {

			let files = scan(BACKUP + '/Profiles/' + HOST + '/chromium', true);
			if (files.length > 0) {

				files.forEach((file) => {

					let data = read(file, 'utf8');
					if (data !== null) {

						try {
							data = JSON.parse(data);
						} catch (err) {
							data = null;
						}

					}

					if (data !== null) {

						let label = file.split('/').pop().split('.').shift();
						if (label !== null) {

							database.push({
								data: data,
								name: label
							});

						}

					}

				});

				callback(true);

			} else {

				callback(false);

			}

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				console.error(PLUGIN.name + ': Cannot restore database due to missing feature in libsecret');

				callback(false);

			} else {

				callback(false);

			}

		}

	}

};


export default PLUGIN;

