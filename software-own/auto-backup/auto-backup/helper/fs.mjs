
import fs from 'fs';

import { isBoolean, isBuffer, isNumber, isString } from '../POLYFILLS.mjs';



const copy_file = (source, target) => {

	if (exists(source, 'file')) {

		let folder = target.split('/').slice(0, -1).join('/');
		if (exists(folder, 'folder') === false) {
			mkdir(folder);
		}


		if (exists(target, 'file') === false) {

			let result = false;

			try {
				fs.copyFileSync(source, target);
				result = true;
			} catch (err) {
				result = false;
			}

			return result;

		}

	}


	return false;

};

const copy_folder = (source, target) => {

	if (exists(source, 'folder')) {

		if (exists(target, 'folder') === false) {

			mkdir(target);

			let mod = mode(source);
			if (mod !== null) {
				mode(target, mod);
			}

		}


		let nodes   = scan(source, false);
		let results = [];

		if (nodes.length > 0) {

			nodes.forEach((node) => {

				let result = false;

				if (exists(source + '/' + node, 'folder')) {

					result = copy_folder(source + '/' + node, target + '/' + node);

				} else if (exists(source + '/' + node, 'file')) {

					result = copy_file(source + '/' + node, target + '/' + node);

				}

				results.push(result);

			});

		}

		if (nodes.length === results.length) {

			if (results.includes(false) === false) {
				return true;
			}

		}

	} else if (exists(source, 'file')) {

		return copy_file(source, target);

	}


	return false;

};



export const mode = (path, mod) => {

	mod = isNumber(mod) ? mod : null;


	if (mod !== null) {

		let result = false;

		try {
			fs.chmodSync(path, mod);
			result = true;
		} catch (err) {
			result = false;
		}

		return result;

	} else {

		let stat = null;

		try {
			stat = fs.lstatSync(path);
		} catch (err) {
			stat = null;
		}

		if (stat !== null && isNumber(stat.mode) === true) {

			let raw = [ 0, 0, 0 ];

			if (stat.mode & 100) raw[0] += 1;
			if (stat.mode & 200) raw[0] += 2;
			if (stat.mode & 400) raw[0] += 4;

			if (stat.mode & 10)  raw[1] += 1;
			if (stat.mode & 20)  raw[1] += 2;
			if (stat.mode & 40)  raw[1] += 4;

			if (stat.mode & 1)   raw[2] += 1;
			if (stat.mode & 2)   raw[2] += 2;
			if (stat.mode & 4)   raw[2] += 4;

			let num = parseInt(raw.join(''), 8);
			if (Number.isNaN(num) === false) {
				return num;
			}

		}


		return null;

	}

};

export const copy = (source, target) => {

	source = isString(source) ? source : null;
	target = isString(target) ? target : null;


	if (source !== null && target !== null) {

		if (exists(source, 'folder')) {

			return copy_folder(source, target);

		} else if (exists(source, 'file')) {

			return copy_file(source, target);

		}

	}

	return false;

};

export const exists = (path, type) => {

	path = isString(path) ? path : null;
	type = isString(type) ? type : null;


	if (path !== null) {

		let stat = null;

		try {
			stat = fs.lstatSync(path);
		} catch (err) {
			stat = null;
		}

		if (stat !== null) {

			if (type !== null) {

				if (type === 'file' && stat.isFile()) {
					return true;
				} else if (type === 'folder' && stat.isDirectory()) {
					return true;
				}

			} else {

				if (stat.isFile()) {
					return true;
				} else if (stat.isDirectory()) {
					return true;
				}

			}

		}

	}


	return false;

};

export const mkdir = (path, chmod) => {

	chmod = isNumber(chmod) ? chmod : 0o777;


	let result = false;

	try {
		fs.mkdirSync(path, {
			recursive: true,
			mode:      chmod
		});
		result = true;
	} catch (err) {
		result = false;
	}

	return result;

};

export const read = (path, enc) => {

	path = isString(path) ? path : null;
	enc  = isString(enc)  ? enc  : 'utf8';


	if (path !== null) {

		let result = null;

		try {
			result = fs.readFileSync(path, enc);
		} catch (err) {
			result = null;
		}

		if (result !== null) {
			return result;
		}

	}


	return null;

};

export const remove = (path) => {

	path = isString(path) ? path : null;


	if (path !== null) {

		let stat = null;

		try {
			stat = fs.lstatSync(path);
		} catch (err) {
			stat = null;
		}

		if (stat !== null) {

			if (stat.isFile()) {

				let result = false;

				try {
					fs.unlinkSync(path);
					result = true;
				} catch (err) {
					result = false;
				}

				return result;

			} else if (stat.isDirectory()) {

				let result = false;

				try {
					fs.rmdirSync(path, {
						recursive: true
					});
					result = true;
				} catch (err) {
					result = false;
				}

				return result;

			}

		}

	}


	return false;

};

export const scan = (path, prefix) => {

	path   = isString(path)    ? path   : null;
	prefix = isBoolean(prefix) ? prefix : true;


	if (path !== null) {

		let result = [];
		let stat   = null;

		try {
			stat = fs.lstatSync(path);
		} catch (err) {
			stat = null;
		}

		if (stat !== null) {

			if (stat.isDirectory()) {

				let tmp = [];

				try {
					tmp = fs.readdirSync(path);
				} catch (err) {
					tmp = [];
				}

				if (tmp.length > 0) {
					tmp.forEach((node) => {

						if (node.startsWith('.') === false) {

							if (prefix === true) {
								result.push(path + '/' + node);
							} else {
								result.push(node);
							}

						}

					});
				}

			}

		}

		return result;

	}


	return [];

};

export const write = (path, buffer) => {

	path   = isString(path)   ? path   : null;
	buffer = isBuffer(buffer) ? buffer : Buffer.from(buffer, 'utf8');


	if (path !== null) {

		let result = false;

		try {
			fs.writeFileSync(path, buffer);
			result = true;
		} catch (err) {
			result = false;
		}

		return result;

	}


	return false;

};



export default {

	copy:   copy,
	exists: exists,
	mkdir:  mkdir,
	mode:   mode,
	read:   read,
	remove: remove,
	scan:   scan,
	write:  write

};

