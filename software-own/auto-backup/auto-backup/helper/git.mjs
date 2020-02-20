
import fs from 'fs';
import { execSync } from 'child_process';
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

const _parse_config = (buffer) => {

	let lines = buffer.trim().split('\n').map((line) => line.trim());
	if (lines.length > 0) {

		let config  = {
			'core':     {},
			'branches': {},
			'remotes':  {}
		};
		let pointer = config.core;

		lines.forEach((line) => {

			if (line.startsWith('[') && line.endsWith(']')) {

				let tmp = line.substr(1, line.length - 2);
				if (tmp === 'core') {

					pointer = config.core;

				} else if (tmp.startsWith('branch ')) {

					let branch = tmp.split(' ').pop();
					if (branch.startsWith('"') && branch.endsWith('"')) {
						branch = branch.substr(1, branch.length - 2);
					}

					config.branches[branch] = config.branches[branch] || {
						remote: null,
						merge:  null
					};

					pointer = config.branches[branch];

				} else if (tmp.startsWith('remote ')) {

					let remote = tmp.split(' ').pop();
					if (remote.startsWith('"') && remote.endsWith('"')) {
						remote = remote.substr(1, remote.length - 2);
					}

					config.remotes[remote] = config.remotes[remote] || {
						url:   null,
						fetch: null
					};

					pointer = config.remotes[remote];

				}

			} else if (line.includes('=')) {

				let tmp = line.split('=').map((v) => v.trim());
				if (tmp.length === 2) {
					pointer[tmp[0]] = _parse_value(tmp[1]);
				}

			}

		});

		return config;

	}

	return null;

};

const _parse_status = (stdout) => {

	let state = {
		branch:  null,
		changes: [],
		remote:  null,
	};


	let lines = stdout.trim().split('\n');
	let line1 = lines[0];

	if (line1.startsWith('## ')) {

		lines.splice(0, 1);


		let tmp1   = line1.slice(3).split('...').map((v) => v.trim());
		let branch = tmp1[0] || null;
		if (branch !== null) {
			state.branch = branch;
		}

	}

	if (lines.length > 0) {

		lines.forEach((line) => {

			let path = line.substr(2).trim();
			let tmp1 = line.substr(0, 2).trim();
			if (tmp1 === '??') {
				state.changes.push({
					path:  path,
					state: 'untracked'
				});
			} else if (tmp1 !== '') {
				state.changes.push({
					path:  path,
					state: 'uncommited'
				});
			}

		});

	}

	return state;

};

const _render_config = (config) => {

	let data = [];

	if (Object.keys(config.core).length > 0) {

		data.push('[core]');

		Object.keys(config.core).forEach((key) => {
			data.push('\t' + key + ' = ' + config.core[key]);
		});

	}

	if (Object.keys(config.branches).length > 0) {

		Object.keys(config.branches).forEach((key) => {

			data.push('[branch "' + key + '"]');

			let branch = config.branches[key];

			for (let key in branch) {
				data.push('\t' + key + ' = ' + branch[key]);
			}

		});

	}

	if (Object.keys(config.remotes).length > 0) {

		Object.keys(config.remotes).forEach((key) => {

			data.push('[remote "' + key + '"]');

			let remote = config.remotes[key];

			for (let key in remote) {
				data.push('\t' + key + ' = ' + remote[key]);
			}

		});

	}

	if (data.length > 0) {
		return Buffer.from(data.join('\n'), 'utf8');
	}


	return null;

};



export const read = (path) => {

	path = isString(path) ? path : null;


	if (path !== null) {

		let config = null;

		try {
			config = _parse_config(fs.readFileSync(path + '/.git/config', 'utf8'));
		} catch (err) {
		}

		if (config !== null) {
			return config;
		}

	}


	return null;

};

export const status = (path) => {

	path = isString(path) ? path : null;


	if (path !== null) {

		let output = null;
		try {
			output = execSync('git status --b --porcelain 2>/dev/null', {
				cwd: path
			}).toString('utf8');
		} catch (err) {
		}

		if (output !== null) {

			let status = _parse_status(output);
			if (status !== null) {
				return status;
			}

		}

	}


	return null;

};

export const write = (path, config) => {

	path   = isString(path)   ? path   : null;
	config = isObject(config) ? config : null;


	if (path !== null && config !== null) {

		let data = _render_config(config);
		if (data !== null) {

			let result = false;
			try {
				fs.writeFileSync(path + '/.git/config', data);
				result = true;
			} catch (err) {
			}

			return result;

		}

	}


	return false;

};



export default {

	read:   read,
	status: status,
	write:  write

};

