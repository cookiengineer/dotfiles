
import { console } from '../console.mjs';
import { chmod, exec, exists, mkdir, read, scan, write, BACKUP, HOME, HOST } from '../helpers.mjs';



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

		key.user = null; // XXX: set via search for public key
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


const _collect = (mode, database, callback) => {

	database['openssh'] = [];


	if (mode === 'backup') {

		if (exists(HOME + '/.ssh')) {

			let files = scan(HOME + '/.ssh', true).filter((file) => file.endsWith('known_hosts') === false);
			if (files.length > 0) {

				files.forEach((file) => {

					let key = _parse_key(file, read(file, 'utf8'));
					if (key !== null) {
						database['openssh'].push(key);
					}

				});

				database['openssh'].forEach((key) => {

					if (key.type === 'private') {

						let public_key = database['openssh'].find((other) => {
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

	} else if (mode === 'restore') {

		let files = scan(BACKUP + '/openssh', true);
		if (files.length > 0) {

			files.forEach((file) => {

				let key = _parse_key(file, read(file, 'utf8'));
				if (key !== null) {
					database['openssh'].push(key);
				}

			});

			database['openssh'].forEach((key) => {

				if (key.type === 'private') {

					let public_key = database['openssh'].find((other) => {
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

			database['openssh'] = database['openssh'].filter((key) => {

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

	}

};

const _details = (mode, database) => {

	database['openssh'] = database['openssh'] || [];


	if (mode === 'backup') {

		if (database['openssh'].length > 0) {
			database['openssh'].forEach((key) => {
				console.log('openssh: ' + key.file.split('/').pop() + ' (' + key.name + ' / ' + key.type + ')');
			});
		}

	} else if (mode === 'restore') {

		if (database['openssh'].length > 0) {
			database['openssh'].forEach((key) => {
				console.log('openssh: ' + key.file.split('/').pop() + ' (' + key.name + ' / ' + key.type + ')');
			});
		}

	}

};

const _execute = (mode, database, callback) => {

	database['openssh'] = database['openssh'] || [];


	if (mode === 'backup') {

		if (database['openssh'].length > 0) {

			if (exists(BACKUP + '/openssh') === false) {
				mkdir(BACKUP + '/openssh');
			}

			database['openssh'].forEach((key) => {

				if (key.type === 'private') {
					write(BACKUP + '/openssh/' + key.name + '.key', key.data);
				} else if (key.type === 'public') {
					write(BACKUP + '/openssh/' + key.name + '.pub', key.data);
				}

			});

			callback(true);

		} else {

			callback(false);

		}

	} else if (mode === 'restore') {

		if (database['openssh'].length > 0) {

			if (exists(HOME + '/.ssh') === false) {
				mkdir(HOME + '/.ssh', 0o700);
			}


			let private_keys = database['openssh'].filter((key) => key.type === 'private');
			let public_keys  = database['openssh'].filter((key) => key.type === 'public');

			if (private_keys.length === 1 && public_keys.length === 1) {

				write(HOME + '/.ssh/id_rsa',     private_keys[0].data);
				write(HOME + '/.ssh/id_rsa.pub', public_keys[0].data);

				chmod(HOME + '/.ssh/id_rsa',     0o600);
				chmod(HOME + '/.ssh/id_rsa.pub', 0o644);

			} else {

				database['openssh'].forEach((key) => {

					let name = key.name;
					if (name.includes('@')) {
						name = key.name.split('@').shift();
					}

					if (key.type === 'private') {
						write(HOME + '/.ssh/' + key.name, key.data);
						chmod(HOME + '/.ssh/' + key.name, 0o600);
					} else if (key.type === 'public') {
						write(HOME + '/.ssh/' + key.name + '.pub', key.data);
						chmod(HOME + '/.ssh/' + key.name + '.pub', 0o644);
					}

				});

			}

			callback(true);

		} else {

			callback(false);

		}

	}

};



export default {

	collect: _collect,
	details: _details,
	execute: _execute

};

