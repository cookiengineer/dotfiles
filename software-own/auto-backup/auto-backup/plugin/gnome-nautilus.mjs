
import { console                          } from '../console.mjs';
import { exists, mkdir, read, scan, write } from '../helper/fs.mjs';
import { search                           } from '../helper/secret.mjs';
import { BACKUP, HOME, HOST               } from '../helper/sh.mjs';



const PLUGIN = {

	name: 'gnome-nautilus',

	init: {

		collect: (database, callback) => {

			if (exists(HOME + '/.local/share/keyrings') === false) {

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

			if (exists(HOME + '/.local/share/keyrings')) {

				let nautilus = search({
					'xdg:schema': 'org.gnome.keyring.NetworkPassword'
				});

				if (nautilus.length > 0) {

					nautilus.forEach((entry) => {

						let label  = entry['label']  || null;
						let schema = entry['schema'] || null;

						if (label !== null && schema !== null) {

							database.push({
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

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				if (exists(BACKUP + '/Profiles/' + HOST + '/gnome/nautilus') === false) {
					mkdir(BACKUP + '/Profiles/' + HOST + '/gnome/nautilus');
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
						write(BACKUP + '/Profiles/' + HOST + '/gnome/nautilus/' + entry.name + '.json', data);
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

							database.push({
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

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				// TODO: Implement once "secret-tool store" supports "schema" property (instead of "attribute.schema")
				console.error(PLUGIN.name + ': Cannot restore database due to missing feature in libsecret');

				callback(false);

			} else {

				callback(false);

			}

		}

	}

};


export default PLUGIN;

