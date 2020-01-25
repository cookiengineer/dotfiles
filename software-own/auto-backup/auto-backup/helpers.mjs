
import console from './console.mjs';
import { execSync } from 'child_process';
import fs from 'fs';
import { isArray, isBoolean, isBuffer, isFunction, isNumber, isString } from './POLYFILLS.mjs';



export const USER = process.env.SUDO_USER || process.env.USER;

export const HOME = (() => {

	if (process.env.SUDO_USER !== undefined) {

		if (process.env.USER === 'root') {
			return '/home/' + process.env.SUDO_USER;
		} else {
			return '/home/' + process.env.USER;
		}

	} else if (process.env.HOME !== undefined) {

		return process.env.HOME;

	} else if (process.env.USER !== undefined) {

		return '/home/' + process.env.USER;

	} else {

		return execSync('echo ~').trim();

	}

})();

export const HOST = (() => {

	let data = null;
	try {
		data = fs.readFileSync('/etc/hostname', 'utf8');
	} catch (err) {
	}

	if (data !== null) {
		return data.trim();
	}

	return null;

})();

export const BACKUP = HOME + '/Backup';



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

export const exec = (cmd, cwd, enc) => {

	cwd = isString(cwd) ? cwd : HOME;
	enc = isString(enc) ? enc : 'utf8';


	let output = null;
	try {
		output = execSync(cmd, {
			cwd: cwd
		}).toString(enc);
	} catch (err) {
	}

	return output;

};

export const exists = (path) => {

	let stat = null;
	try {
		stat = fs.lstatSync(path);
	} catch (err) {
	}

	if (stat !== null) {

		if (stat.isFile()) {
			return true;
		} else if (stat.isDirectory()) {
			return true;
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

const process_stack = (stack, results, parameters, callback) => {

	let entry = stack.shift() || null;
	if (entry !== null) {

		let args = parameters.slice();

		args.push((result) => {
			results.push(result);
			process_stack(stack, results, parameters, callback);
		});

		try {

			entry.apply(null, args);

		} catch (err) {

			console.error(err);

			results.push(null);
			process_stack(stack, results, parameters, callback);

		}

	} else {

		callback(results);

	}

};

export const queue = (callbacks, parameters, callback) => {

	callbacks  = isArray(callbacks)   ? callbacks.filter((c) => isFunction(c)) : [];
	parameters = isArray(parameters)  ? parameters                             : [];
	callback   = isFunction(callback) ? callback                               : null;


	let stack = callbacks.slice();
	if (stack.length > 0) {
		process_stack(stack, [], parameters, callback);
	} else {
		callback([]);
	}

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
	exec:   exec,
	exists: exists,
	mkdir:  mkdir,
	queue:  queue,
	read:   read,
	scan:   scan,
	write:  write

};

