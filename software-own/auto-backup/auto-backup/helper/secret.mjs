
import { console } from '../console.mjs';
import { execSync } from 'child_process';
import { HOME } from './sh.mjs';
import { isObject, isString } from '../POLYFILLS.mjs';



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

const _parse_collections = (stdout) => {

	let result = [];

	let lines = stdout.split('\n').map((line) => line.trim()).filter((line) => line !== '');
	if (lines.length > 0 && lines[0].startsWith('[') && lines[0].endsWith(']')) {

		let pointer = null;

		lines.forEach((line) => {

			if (line.startsWith('[') && line.endsWith(']')) {

				let id = line.substr(1, line.length - 2);
				if (id.includes('/')) {
					id = id.split('/').pop();
				}

				result.push({ '@id': _parse_value(id) });
				pointer = result[result.length - 1];

			} else if (line.includes(' = ')) {

				let tmp = line.split(' = ').map((v) => v.trim());
				if (tmp.length === 2) {

					let key = tmp[0].trim();
					let val = _parse_value(tmp[1]);

					if (key !== '') {
						pointer[key] = _parse_value(val);
					}

				}

			}

		});

		if (result.length > 0) {
			return result;
		}

	}

	return result;

};



export const search = (object) => {

	object = isObject(object) ? object : {};


	let result = [];
	let params = Object.keys(object).map((key) => {

		if (key.includes(' ')) {
			key = '"' + key + '"';
		}

		let val = (object[key]).toString();
		if (val.includes(' ')) {
			val = '"' + val + '"';
		}

		return key + ' ' + val;

	}).join(' ');


	let stdout = null;
	try {
		stdout = execSync('secret-tool search --all ' + params + ' 2>&1', {
			cwd: HOME
		}).toString('utf8');
	} catch (err) {
	}

	if (stdout !== null) {

		let collections = _parse_collections(stdout);
		if (collections.length > 0) {
			collections.forEach((collection) => {

				if (collection['@id'] !== undefined) {
					result.push(collection);
				}

			});
		}

	}

	return result;

};



export default {

	search: search

};

