
import { execSync } from 'child_process';
import { console } from '../console.mjs';
import { isObject, isString } from '../POLYFILLS.mjs';



const SEPARATOR = {
	column: '%-_-%',   // has to not appear with empty fields
	row:    '%\n\n\n%' // has to not appear with multiple line values
};

const isQuery = (str) => {
	return str.startsWith('SELECT') && str.includes('FROM');
};



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

const _parse_query = (stdout) => {

	let result = [];
	let lines  = stdout.trim().split(SEPARATOR.row).map((line) => line.trim()).filter((line) => line !== '');

	if (lines.length > 0) {

		let header = lines.shift().split(SEPARATOR.column).map((val) => val.trim());
		if (header.length > 0) {

			lines.forEach((line) => {

				let values = line.split(SEPARATOR.column).map((val) => val.trim());
				if (values.length > 0) {

					let object = {};

					values.forEach((val, v) => {

						let key = header[v] || null;
						if (key !== null) {
							object[key] = _parse_value(val);
						}

					});

					if (Object.keys(object).length > 0) {
						result.push(object);
					}

				}

			});

		}

	}

	return result;

};

export const query = (query, path) => {

	query  = isQuery(query) ? query : null;
	path   = isString(path) ? path  : null;


	if (query !== null && path !== null) {

		let cwd    = path.split('/').slice(0, -1).join('/');
		let result = [];
		let stdout = null;
		try {
			stdout = execSync('sqlite3 -header -readonly -newline "' + SEPARATOR.row + '" -separator "' + SEPARATOR.column + '" "' + path + '" "' + query + '" 2>/dev/null', {
				cwd: cwd
			}).toString('utf8');
		} catch (err) {
		}

		if (stdout !== null) {

			let rows = _parse_query(stdout);
			if (rows.length > 0) {
				rows.forEach((row) => {
					result.push(row);
				});
			}

		}

		return result;

	}


	return [];

};



export default {

	query: query

};

