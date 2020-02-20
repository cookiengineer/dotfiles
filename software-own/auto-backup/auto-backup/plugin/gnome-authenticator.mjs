
import { console } from '../console.mjs';
import { exists, mkdir, read, scan, write } from '../helper/fs.mjs';
import { query } from '../helper/sqlite.mjs';
import { search } from '../helper/secret.mjs';
import { BACKUP, HOME, HOST } from '../helper/sh.mjs';



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

const _collect = (mode, database, callback) => {

	database['gnome-authenticator'] = [];


	if (mode === 'backup') {

		if (
			exists(HOME + '/.local/share/keyrings')
			&& exists(HOME + '/.config/Authenticator/database-7.db')
		) {

			let accounts = query('SELECT accounts.username, accounts.token_id, providers.name AS service, providers.website as website FROM accounts JOIN providers ON accounts.provider=providers.id', HOME + '/.config/Authenticator/database-7.db');
			let entries  = search({
				'xdg:schema': 'com.github.bilelmoussaoui.Authenticator'
			});


			if (accounts.length > 0 && entries.length > 0) {

				accounts.forEach((account) => {

					let entry = entries.find((entry) => entry['attribute.id'] === account['token_id']) || null;
					if (entry !== null) {

						let service = (account['service'] || '').toLowerCase() || null;
						if (service === null) {
							service = _get_service(account['website']);
						} else if (service.includes('.')) {
							service = service.split('.').shift();
						}

						let label = account['username'];
						if (label.includes('@') === true) {
							label = label.split('@').shift() + '@' + service;
						} else {
							label = label + '@' + service;
						}

						let schema = entry['schema'] || null;
						if (schema !== null) {

							database['gnome-authenticator'].push({
								data: {
									'label':          label,
									'schema':         schema,
									'secret':         entry['secret'],
									'service':        account['service'],
									'username':       account['username'],
									'website':        account['website'],
									'attribute.id':   entry['attribute.id']   || null,
									'attribute.name': entry['attribute.name'] || null,
								},
								name:   label,
								schema: schema
							});

						}

					}

				});

				callback(true);

			} else {

				callback(false);

			}

		} else {

			callback(false);

		}

	} else if (mode === 'restore') {

		let files = scan(BACKUP + '/Profile/gnome/authenticator', true);
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

					let label  = file.split('/').pop().split('.').shift();
					let schema = data['schema'] || null;

					if (label !== null && schema !== null) {

						database['gnome-authenticator'].push({
							data: data,
							name: label,
							type: schema
						});

					}

				}

			});

			callback(true);

		} else {

			callback(false);

		}

	}

};

const _details = (mode, database) => {

	database['gnome-authenticator'] = database['gnome-authenticator'] || [];


	if (mode === 'backup') {

		if (database['gnome-authenticator'].length > 0) {
			database['gnome-authenticator'].forEach((entry) => {
				console.log('gnome-authenticator: ' + entry.name);
			});
		}

	} else if (mode === 'restore') {

		if (database['gnome-authenticator'].length > 0) {
			database['gnome-authenticator'].forEach((entry) => {
				console.log('gnome-authenticator: ' + entry.name);
			});
		}

	}

};

const _execute = (mode, database, callback) => {

	database['gnome-authenticator'] = database['gnome-authenticator'] || [];


	if (mode === 'backup') {

		if (database['gnome-authenticator'].length > 0) {

			if (exists(BACKUP + '/Profile/gnome/authenticator') === false) {
				mkdir(BACKUP + '/Profile/gnome/authenticator');
			}

			database['gnome-authenticator'].forEach((entry) => {

				let data = null;
				try {
					data = Buffer.from(JSON.stringify(entry.data, null, '\t'), 'utf8');
				} catch (err) {
				}

				if (data !== null) {
					console.log('gnome-authenticator: archiving ' + entry.name + ' ...');
					write(BACKUP + '/Profile/gnome/authenticator/' + entry.name + '.json', data);
				}

			});

			callback(true);

		} else {

			callback(false);

		}

	} else if (mode === 'restore') {

		if (database['gnome-authenticator'].length > 0) {

			// XXX: Cannot restore authenticator secrets
			// No import feature in secret-tool

			callback(false);

		} else {

			callback(false);

		}

	}

};



export default {

	name:   'gnome-authenticator',

	collect: _collect,
	details: _details,
	execute: _execute

};

