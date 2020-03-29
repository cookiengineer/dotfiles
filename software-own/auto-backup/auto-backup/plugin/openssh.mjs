
import { console                                } from '../console.mjs';
import { exists, mkdir, read, mode, scan, write } from '../helper/fs.mjs';
import { BACKUP, HOME, HOST                     } from '../helper/sh.mjs';



const _parse_key = (file, data) => {

	let lines = data.split('\n');
	let key   = {
		data: data,
		file: file,
		name: null,
		user: null,
		type: null
	};


	let line1 = lines[0];
	if (line1.includes('BEGIN OPENSSH PRIVATE KEY')) {

		key.user = null; // set via search for public key
		key.type = 'private';

		return key;

	} else if (line1.startsWith('ssh-rsa ')) {

		key.name = line1.split(' ').pop().split('@').shift() || null;
		key.user = line1.split(' ').pop();
		key.type = 'public';

		return key;

	}


	return null;

};



const PLUGIN = {

	name: 'openssh',

	init: {

		collect: (database, callback) => {

			if (exists(HOME + '/.ssh/id_rsa') === false) {

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

			if (exists(HOME + '/.ssh')) {

				let files = scan(HOME + '/.ssh', true).filter((file) => file.endsWith('known_hosts') === false);
				if (files.length > 0) {

					files.forEach((file) => {

						let key = _parse_key(file, read(file, 'utf8'));
						if (key !== null) {
							database.push(key);
						}

					});

					database.forEach((key) => {

						if (key.type === 'private') {

							let public_key = database.find((other) => {
								return other.file === key.file + '.pub' && other.type === 'public';
							}) || null;

							if (public_key !== null && public_key.name !== null) {

								public_key.name = public_key.name + '@' + HOST;
								key.name        = public_key.name;
								key.user        = public_key.user;

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

		},

		details: (database) => {

			if (database.length > 0) {
				database.forEach((key) => {
					console.info(PLUGIN.name + ': ' + key.file.split('/').pop() + ' (' + key.name + ' / ' + key.type + ')');
				});
			}

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				if (exists(BACKUP + '/Profiles/' + HOST + '/openssh') === false) {
					mkdir(BACKUP + '/Profiles/' + HOST + '/openssh');
				}

				database.forEach((key) => {

					if (key.type === 'private') {

						console.log(PLUGIN.name + ': archiving ' + key.name + ' ...');

						write(BACKUP + '/Profiles/' + HOST + '/openssh/' + key.name + '.key', key.data);

					} else if (key.type === 'public') {

						console.log(PLUGIN.name + ': archiving ' + key.name + ' ...');

						write(BACKUP + '/Profiles/' + HOST + '/openssh/' + key.name + '.pub', key.data);

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

			let files = scan(BACKUP + '/Profiles/' + HOST + '/openssh', true);
			if (files.length > 0) {

				files.forEach((file) => {

					let key = _parse_key(file, read(file, 'utf8'));
					if (key !== null) {
						database.push(key);
					}

				});

				database.forEach((key) => {

					if (key.type === 'private') {

						let public_key = database.find((other) => {
							return other.file === key.file.replace('.key', '.pub') && other.type === 'public';
						}) || null;

						if (public_key !== null && public_key.name !== null) {

							let basename = key.file.split('/').pop();
							if (basename.includes('@')) {

								if (basename.endsWith('.key') || basename.endsWith('.pub')) {
									public_key.name = basename.substr(0, basename.length - 4);
								}

							}

							key.name = public_key.name;
							key.user = public_key.user;

						}

					}

				});

				database = database.filter((key) => {

					let host = key.name.split('@').pop();
					if (host === HOST) {
						return true;
					}

					return false;

				});

				callback(true);

			} else {

				callback(false);

			}

		},

		details: (database) => {

			if (database.length > 0) {
				database.forEach((key) => {
					console.info(PLUGIN.name + ': ' + key.file.split('/').pop() + ' (' + key.name + ' / ' + key.type + ')');
				});
			}

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				if (exists(HOME + '/.ssh') === false) {
					mkdir(HOME + '/.ssh', 0o700);
				}


				let private_keys = database.filter((key) => key.type === 'private');
				let public_keys  = database.filter((key) => key.type === 'public');

				if (private_keys.length === 1 && public_keys.length === 1) {

					console.log(PLUGIN.name + ': restoring ' + private_keys[0].name + ' ...');

					write(HOME + '/.ssh/id_rsa',     private_keys[0].data);
					write(HOME + '/.ssh/id_rsa.pub', public_keys[0].data);

					mode(HOME + '/.ssh/id_rsa',     0o600);
					mode(HOME + '/.ssh/id_rsa.pub', 0o644);

				} else {

					database.forEach((key) => {

						console.log(PLUGIN.name + ': restoring ' + key.name + ' ...');

						let name = key.name;
						if (name.includes('@')) {
							name = key.name.split('@').shift();
						}

						if (key.type === 'private') {

							write(HOME + '/.ssh/' + name, key.data);
							mode(HOME + '/.ssh/' + name, 0o600);

						} else if (key.type === 'public') {

							write(HOME + '/.ssh/' + name + '.pub', key.data);
							mode(HOME + '/.ssh/' + name + '.pub', 0o644);

						}

					});

				}

				callback(true);

			} else {

				callback(false);

			}

		}

	}

};


export default PLUGIN;

