
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

export const copy = (origin, target) => {

	origin = isString(origin) ? origin : null;
	target = isString(target) ? target : null;


	if (origin !== null && target !== null) {

		let result = false;
		try {
			fs.copyFileSync(origin, target);
			result = true;
		} catch (err) {
		}

		return result;

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
		}

		return result;

	}


	return false;

};



export default {

	chmod:  chmod,
	copy:   copy,
	exists: exists,
	mkdir:  mkdir,
	read:   read,
	remove: remove,
	scan:   scan,
	write:  write

};

