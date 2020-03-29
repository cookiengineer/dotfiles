
import fs from 'fs';
import { execSync } from 'child_process';

import { isString } from '../POLYFILLS.mjs';



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
		data = null;
	}

	if (data !== null) {
		return data.trim();
	}

	return null;

})();

export const BACKUP   = HOME + '/Backup';
export const MUSIC    = HOME + '/Music';
export const SOFTWARE = HOME + '/Software';

export const exec = (cmd, cwd, enc) => {

	cwd = isString(cwd) ? cwd : HOME;
	enc = isString(enc) ? enc : 'utf8';


	let output = null;

	try {
		output = execSync(cmd, {
			cwd: cwd
		}).toString(enc);
	} catch (err) {
		output = null;
	}

	return output;

};



export default {

	BACKUP:   BACKUP,
	HOME:     HOME,
	HOST:     HOST,
	SOFTWARE: SOFTWARE,
	USER:     USER,

	exec:     exec

};

