
import { console } from '../console.mjs';
import { exec, exists, mkdir, read, scan, write, BACKUP, HOME } from '../helpers.mjs';



const _parse_line = (line) => {
	return line.trim().split(' ').filter((v) => v !== '');
};

const _parse_import = (stdout) => {

	let lines = stdout.split('\n').map((line) => line.trim()).map((line) => {

		if (line.startsWith('gpg:')) {
			line = line.substr(4).trim();
		}

		return line;

	});

	let line1 = _parse_line(lines[0]);
	let line2 = _parse_line(lines[1]);

	if (line1[0] === 'key' && line2[0] === 'key') {

		if (line1[1] === line2[1]) {

			if (line2.slice(2).join(' ') === 'secret key imported') {
				return true;
			}

		}

	}

	return false;

};

const _parse_keylist = (stdout) => {

	let lines  = stdout.split('\n').map((line) => line.trim());
	let result = [];

	let tmp1 = lines[0];
	if (tmp1.endsWith('.kbx')) {
		lines.splice(0, 1);
	}

	let tmp2 = lines[0];
	if (tmp2.match(/-/g).length === tmp2.length) {
		lines.splice(0, 1);
	}

	let secrets = lines.filter((line) => _parse_line(line).shift() === 'sec');
	if (secrets.length > 0) {

		secrets.forEach((line) => {

			let index = lines.indexOf(line);
			let line1 = _parse_line(lines[index + 1]);
			let line2 = _parse_line(lines[index + 2]);

			let key = {
				data: null,
				file: null,
				hash: null,
				name: null,
				type: 'unknown',
				user: 'unknown',
			};

			let hash = line1[0];
			if (/^([A-Z0-9]+)$/g.test(hash) === true) {
				key.hash = hash;
			}

			if (line2[0] === 'uid') {

				let tmp = line2.slice(1);
				if (tmp[0] === '[ultimate]') {
					key.type = 'ultimate';
					tmp.splice(0, 1);
				}

				let user = tmp.join(' ');
				if (user.includes('<') && user.includes('>')) {

					key.user = user;

					let name = user.split(' ').pop();
					if (name.startsWith('<') && name.endsWith('>')) {
						key.name = name.substr(1, name.length - 2);
					}

				} else {
					key.name = key.hash;
				}

			}


			if (key.hash !== null && key.name !== null) {
				result.push(key);
			}

		});

	}

	return result;

};



const _collect = (mode, database, callback) => {

	database['gnupg'] = [];


	if (mode === 'backup') {

		if (
			exists(HOME + '/.gnupg')
			&& exists(HOME + '/.gnupg/private-keys-v1.d')
		) {

			let keys = _parse_keylist(exec('gpg --list-secret-keys', HOME));
			if (keys.length > 0) {

				keys.forEach((key) => {
					database['gnupg'].push(key);
				});

				callback(true);

			} else {

				callback(false);

			}

		} else {

			callback(false);

		}

	} else if (mode === 'restore') {

		let files = scan(BACKUP + '/gnupg', true);
		if (files.length > 0) {

			files.forEach((file) => {

				let keys = _parse_keylist(exec('gpg --import-options show-only --import "' + file + '" 2>/dev/null', HOME));
				if (keys.length > 0) {

					keys.forEach((key) => {

						let data = read(file, 'hex');
						if (data !== null) {
							key.data = Buffer.from(data, 'hex');
							key.file = file;
							database['gnupg'].push(key);
						}

					});

				}

			});

			callback(true);

		} else {

			callback(false);

		}

	}

};

const _details = (mode, database) => {

	database['gnupg'] = database['gnupg'] || [];


	if (mode === 'backup') {

		if (database['gnupg'].length > 0) {
			database['gnupg'].forEach((key) => {
				console.log('gnupg: ' + key.hash + ' (' + key.user + '/' + key.type + ')');
			});
		}

	} else if (mode === 'restore') {

		if (database['gnupg'].length > 0) {
			database['gnupg'].forEach((key) => {
				console.log('gnupg: ' + key.hash + ' (' + key.user + '/' + key.type + ')');
			});
		}

	}

};

const _execute = (mode, database, callback) => {

	database['gnupg'] = database['gnupg'] || [];


	if (mode === 'backup') {

		if (database['gnupg'].length > 0) {

			if (exists(BACKUP + '/gnupg') === false) {
				mkdir(BACKUP + '/gnupg');
			}

			database['gnupg'].forEach((key) => {

				if (key.type === 'ultimate') {

					let data = exec('gpg --export-secret-key "' + key.hash + '" 2>/dev/null', HOME, 'hex');
					if (data !== null) {
						key.data = Buffer.from(data, 'hex');
					}

				}

				if (key.data !== null) {
					write(BACKUP + '/gnupg/' + key.name + '.asc', key.data);
				}

			});

			callback(true);

		} else {

			callback(false);

		}

	} else if (mode === 'restore') {

		if (database['gnupg'].length > 0) {

			let results = [];

			database['gnupg'].forEach((key) => {

				if (key.file !== null) {

					let result = _parse_import(exec('gpg --allow-secret-key-import --import "' + key.file + '" 2>&1'));
					if (result === true) {
						results.push(result);
					} else if (result === false) {
						results.push(result);
					}

				} else {

					// TODO: import keys from stdin

				}

			});

			if (results.includes(false) === false) {
				callback(true);
			} else {
				callback(false);
			}

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

