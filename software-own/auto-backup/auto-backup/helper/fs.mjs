
import fs from 'fs';
import { isBoolean, isBuffer, isNumber, isString } from '../POLYFILLS.mjs';



export const chmod = (path, chmod) => {

	chmod = isNumber(chmod) ? chmod : 0o777;


	let result = false;
	try {
		fs.chmodSync(path, chmod);
		result = true;
	} catch (err) {
	}

	return result;

};

export const exists = (path, type) => {

	type = isString(type) ? type : null;


	let stat = null;
	try {
		stat = fs.lstatSync(path);
	} catch (err) {
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
	}

	return result;

};

export const read = (path, enc) => {

	enc = isString(enc) ? enc : 'utf8';


	let result = null;
	try {
		result = fs.readFileSync(path, enc);
	} catch (err) {
	}

	if (result !== null) {
		return result;
	}


	return null;

};

export const remove = (path) => {

	let stat = null;
	try {
		stat = fs.lstatSync(path);
	} catch (err) {
	}

	if (stat !== null) {

		if (stat.isFile()) {

			let result = false;
			try {
				fs.unlinkSync(path);
				result = true;
			} catch (err) {
			}

			return result;

		} else if (stat.isDirectory()) {

			let result = false;
			try {
				fs.rmdirSync(path, {
					recursive: true
				});
			} catch (err) {

			}

			return result;

		}

	}

	return false;

};

export const scan = (path, prefix) => {

	prefix = isBoolean(prefix) ? prefix : true;


	let result = [];
	let stat   = null;
	try {
		stat = fs.lstatSync(path);
	} catch (err) {
	}

	if (stat !== null) {

		if (stat.isDirectory()) {

			let tmp = [];
			try {
				tmp = fs.readdirSync(path);
			} catch (err) {
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

};

export const write = (path, buffer) => {

	buffer = isBuffer(buffer) ? buffer : Buffer.from(buffer, 'utf8');


	let result = false;
	try {
		fs.writeFileSync(path, buffer);
		result = true;
	} catch (err) {
	}

	return result;

};



export default {

	chmod:  chmod,
	exists: exists,
	mkdir:  mkdir,
	read:   read,
	remove: remove,
	scan:   scan,
	write:  write

};

