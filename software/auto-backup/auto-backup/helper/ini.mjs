
import fs from 'fs';

import { isString } from '../POLYFILLS.mjs';



const _parse_value = (raw) => {

	if (raw === 'true') {

		return true;

	} else if (raw === 'false') {

		return false;

	} else if (/^([0-9]+)$/g.test(raw) === true) {

		let num = parseInt(raw, 10);
		if (Number.isNaN(num) === false) {
			return num;
		} else {
			return raw;
		}

	} else {

		return raw;

	}

};

const _parse_config = (buffer) => {

	let lines = buffer.trim().split('\n').map((line) => line.trim());
	if (lines.length > 0) {

		let config  = [];
		let section = null;

		lines.forEach((line) => {

			if (line.startsWith('[') && line.endsWith(']')) {

				section = {
					'@id': line.substr(1, line.length - 2)
				};

				config.push(section);

			} else if (section !== null && line.includes('=')) {

				let key = line.split('=').shift();
				let val = line.split('=').slice(1).join('=');

				section[key] = _parse_value(val);

			}

		});

		if (config.length > 0) {
			return config;
		}

	}


	return null;

};



export const read = (path) => {

	path = isString(path) ? path : null;


	if (path !== null) {

		let config = null;

		try {
			config = _parse_config(fs.readFileSync(path, 'utf8'));
		} catch (err) {
			config = null;
		}

		if (config !== null) {
			return config;
		}

	}


	return null;

};



export default {

	read: read

};

