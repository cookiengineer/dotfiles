#!/usr/bin/env node

const fs    = require('fs');
const exec  = require('child_process').exec;
const _HOME = '/home/' + (process.env.SUDO_USER || process.env.USER);
const _APPS = {

};


if (process.env.SUDO_USER === undefined) {
	console.log('Please use sudo!');
	process.exit();
}



/*
 * HELPERS
 */

const _exists = function(path) {

	let stat = null;
	try {
		stat = fs.lstatSync(path, 'utf8');
	} catch (err) {
	}

	if (stat !== null) {

		if (stat.isDirectory()) {
			return true;
		}

		if (stat.isFile()) {
			return true;
		}

	}

	return false;

};

const _is_dir = function(path) {

	let stat = null;
	try {
		stat = fs.lstatSync(path, 'utf8');
	} catch (err) {
	}

	if (stat !== null) {

		if (stat.isDirectory()) {
			return true;
		}

	}

	return false;

};

const _is_file = function(path) {

	let stat = null;
	try {
		stat = fs.lstatSync(path, 'utf8');
	} catch (err) {
	}

	if (stat !== null) {

		if (stat.isFile()) {
			return true;
		}

	}

	return false;

};

const _read_dir = function(path, types, prefix) {

	types  = types instanceof Array      ? types  : [ 'dir', 'file' ];
	prefix = typeof prefix === 'boolean' ? prefix : false;


	let filtered = [];
	let result   = null;
	try {
		result = fs.readdirSync(path);
	} catch (err) {
	}

	if (result !== null) {

		result.forEach((entry) => {

			let type = _is_dir(path + '/' + entry) ? 'dir' : 'file';
			if (types.includes(type)) {

				if (prefix === true) {
					filtered.push(path + '/' + entry);
				} else {
					filtered.push(entry);
				}

			}

		});

	}

	return filtered;

};

const _read_file = function(path) {

	let result = null;
	try {
		result = fs.readFileSync(path, 'utf8');
	} catch (err) {
	}

	return result;

};

const _remove = function(path) {

	if (_is_dir(path)) {
		// TODO: rm -rf
	} else if (_is_file(path)) {
		fs.unlinkSync(path);
	}

};



/*
 * IMPLEMENTATION
 */

const _cleanup_locales = function() {

	let lines   = _read_file('/etc/locale.conf').trim().split('\n');
	let locales = [];

	if (lines.length > 0) {

		lines.forEach((line) => {

			let tmp = line.split('=');
			if (tmp.length === 2) {

				let raw = tmp[1];
				if (raw.includes('.')) {
					raw = raw.split('.').shift();
				}

				if (raw.includes('_')) {

					let base = raw.split('_').shift();
					let lang = raw.split('_').pop();


					if (_exists('/usr/share/locale/' + base)) {

						if (locales.includes(base) === false) {
							locales.push(base);
						}

					}

					if (_exists('/usr/share/locale/' + base + '_' + lang)) {

						if (locales.includes(base + '_' + lang) === false) {
							locales.push(base + '_' + lang);
						}

					}

				} else {

					let base = raw;

					if (_exists('/usr/share/locale/' + base)) {

						if (locales.includes(base) === false) {
							locales.push(base);
						}

					}

				}

			}

		});

	}

	if (locales.length > 0) {

		let directories = _read_dir('/usr/share/locale', [ 'dir' ], false);
		if (directories.length > 0) {

			directories = directories.filter((locale) => {
				return locales.includes(locale) === false;
			});

			directories.forEach((locale) => {
				_remove('/usr/share/locale/' + locale);
			});

		}

	}

};



_cleanup_locales();

