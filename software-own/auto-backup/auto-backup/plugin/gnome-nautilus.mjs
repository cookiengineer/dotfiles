
import { console } from '../console.mjs';
import { exists, mkdir, read, scan, write } from '../helper/fs.mjs';
import { search } from '../helper/secret.mjs';
import { BACKUP, HOME, HOST } from '../helper/sh.mjs';



const _collect = (mode, database, callback) => {

	database['gnome-nautilus'] = [];


	if (mode === 'backup') {

		if (exists(HOME + '/.local/share/keyrings')) {

			let nautilus = search({
				'xdg:schema': 'org.gnome.keyring.NetworkPassword'
			});

			if (nautilus.length > 0) {

				nautilus.forEach((entry) => {

					let label  = entry['label']  || null;
					let schema = entry['schema'] || null;

					if (label !== null && schema !== null) {

						database['gnome-nautilus'].push({
							data: {
								'label':              label,
								'schema':             schema,
								'secret':             entry['secret']             || null,
								'attribute.authtype': entry['attribute.authtype'] || null,
								'attribute.protocol': entry['attribute.protocol'] || null,
								'attribute.user':     entry['attribute.user']     || null,
								'attribute.server':   entry['attribute.server']   || null,
							},
							name: label,
							type: schema
						});

					}

				});

			}

			callback(true);

		} else {

			callback(false);

		}

	} else if (mode === 'restore') {

		let files = scan(BACKUP + '/Profiles/' + HOST + '/gnome/nautilus', true);
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

					let label  = data['label']  || null;
					let schema = data['schema'] || null;

					if (label !== null && schema !== null) {

						database['gnome-nautilus'].push({
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

	database['gnome-nautilus'] = database['gnome-nautilus'] || [];


	if (mode === 'backup') {

		if (database['gnome-nautilus'].length > 0) {
			database['gnome-nautilus'].forEach((entry) => {
				console.log('gnome-nautilus: ' + entry.name);
			});
		}

	} else if (mode === 'restore') {

		if (database['gnome-nautilus'].length > 0) {
			database['gnome-nautilus'].forEach((entry) => {
				console.log('gnome-nautilus: ' + entry.name);
			});
		}

	}

};

const _execute = (mode, database, callback) => {

	database['gnome-nautilus'] = database['gnome-nautilus'] || [];


	if (mode === 'backup') {

		if (database['gnome-nautilus'].length > 0) {

			if (exists(BACKUP + '/Profiles/' + HOST + '/gnome/nautilus') === false) {
				mkdir(BACKUP + '/Profiles/' + HOST + '/gnome/nautilus');
			}

			database['gnome-nautilus'].forEach((entry) => {

				let data = null;
				try {
					data = Buffer.from(JSON.stringify(entry.data, null, '\t'), 'utf8');
				} catch (err) {
				}

				if (data !== null) {
					console.log('gnome-nautilus: archiving ' + entry.name + ' ...');
					write(BACKUP + '/Profiles/' + HOST + '/gnome/nautilus/' + entry.name + '.json', data);
				}

			});

			callback(true);

		} else {

			callback(false);

		}

	} else if (mode === 'restore') {

		if (database['gnome-nautilus'].length > 0) {

			// TODO: Implement this once secret-tool store works the same way
			// and supports setting `schema` property instead of `attribute.schema`

			console.error('gnome-nautilus: Cannot restore database due to missing feature in libsecret.');
			callback(false);

		} else {

			callback(false);

		}

	}

};



export default {

	name:   'gnome-nautilus',

	collect: _collect,
	details: _details,
	execute: _execute

};

