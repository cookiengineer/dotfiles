#!/usr/bin/env node

const fs       = require('fs');
const execSync = require('child_process').execSync;

const _BACKUP   = '/home/' + process.env.USER + '/Backup';
const _SOFTWARE = '/home/' + process.env.USER + '/Software';
const _FLAGS    = Array.from(process.argv).filter(v => v.startsWith('--')).map(v => v.substr(2));
const _SELF     = (function(buffer) {
	return buffer.toString('utf8').split('\n').shift().trim();
})(fs.readFileSync('/etc/hostname'));


const _args_to_string = function(args) {

	let output = [];

	for (let a = 0, al = args.length; a < al; a++) {

		let arg = args[a];
		if (typeof arg === 'string') {
			output[a] = arg;
		} else {
			output[a] = JSON.stringify(args[a], null, '\t');
		}

	}

	return output.join(' ');

};

const _consol = global.console;
const console = {

	clear: function() {

		// clear screen and reset cursor
		process.stdout.write('\x1B[2J\x1B[0f');

		// clear scroll buffer
		process.stdout.write('\u001b[3J');

	},

	info: function() {

		let al   = arguments.length;
		let args = [ '(I)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		process.stdout.write('\u001b[42m\u001b[97m ' + _args_to_string(args) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	},

	log: function() {

		let al   = arguments.length;
		let args = [ '(L)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		process.stdout.write('\u001b[49m\u001b[97m ' + _args_to_string(args) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	},

	warn: function() {

		let al   = arguments.length;
		let args = [ '(W)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		process.stdout.write('\u001b[43m\u001b[97m ' + _args_to_string(args) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	},

	error: function() {

		let al   = arguments.length;
		let args = [ '(E)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		process.stderr.write('\u001b[41m\u001b[97m ' + _args_to_string(args) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	}

};



/*
 * CONFIG
 */

const _ORGAS = [
	'cookiengineer',
	'humansneednotapply',
	'Artificial-Engineering',
	'Artificial-University',
	'polyfillr'
];

const _PEERS = [
	'tinky',
	'weep',
	'wuup'
];



/*
 * HELPERS
 */

const _backup = function(config, status) {

	let folder = false;
	let backup = false;

	try {

		let check = fs.existsSync(_BACKUP + '/' + config.meta.orga);
		if (check === true) {
			folder = true;
		} else {
			fs.mkdirSync(_BACKUP + '/' + config.meta.orga, {
				recursive: true
			});
			folder = true;
		}

	} catch (err) {
		folder = false;
	}

	if (folder === true) {

		try {

			let file = _BACKUP + '/' + config.meta.orga + '/' + config.meta.repo + '.tar.xz';
			let tmp  = execSync('tar cvfJ "' + file + '" "' + config.meta.repo + '"', {
				cwd: _SOFTWARE + '/' + config.meta.orga
			});

			let stdout = tmp.toString('utf8').trim();
			if (stdout !== '' && stdout.includes('refusing to create empty archive') === false) {
				backup = true;
			}

		} catch (err) {
			backup = false;
		}

	}

	return backup;

};

const _fetch = function(config, status) {

	let remotes = [];

	if (_FLAGS.includes('online') === true) {
		remotes = Object.keys(config.remotes).filter(r => (r === 'gitlab' || r === 'github'));
	} else {
		remotes = Object.keys(config.remotes).filter(r => (r !== 'gitlab' || r !== 'github'));
	}

	if (remotes.length > 0) {

		let results = remotes.map(remote => {

			let result = false;

			try {

				let tmp = execSync('git fetch --multiple ' + remotes.join(' '), {
					cwd: config.meta.path
				});

				let stdout = tmp.toString('utf8').trim();
				if (stdout !== '') {
					result = true;
				}

			} catch (err) {

				let stderr = err.stderr.toString('utf8');
				if (stderr.includes('unable to connect')) {
					result = true;
				} else {
					result = false;
				}

			}

			return result;

		});

		// Peer-to-Peer means any Peer wins
		if (results.includes(true)) {
			return true;
		}

	}


	return false;

};

const _merge = function(config, status) {

	let result = false;

	try {

		let tmp = execSync('git merge FETCH_HEAD', {
			cwd: config.meta.path
		});

		let stdout = tmp.toString('utf8').trim();
		if (stdout !== '') {
			result = true;
		}

	} catch (err) {
		result = false;
	}

	return result;

};

const _push = function(config, status) {

	let remotes = [];

	if (_FLAGS.includes('online') === true) {
		remotes = Object.keys(config.remotes).filter(r => (r === 'gitlab' || r === 'github'));
	}

	if (remotes.length > 0) {

		let branch = status.branch || 'master';
		let result = false;

		remotes.forEach(remote => {

			try {
				execSync('git push ' + remote + ' ' + branch, {
					cwd: config.meta.path
				});
			} catch (err) {
				result = false;
			}

		});

		return result;

	}

	return true;

};

const _remove = function(config, status, name) {

	let remote = config.remotes[name] || null;
	if (remote !== null) {
		delete config.remotes[name];
	}

	let refs = Object.keys(status.remotes[name] || {});
	if (refs.length > 0) {

		delete status.remotes[name];

		refs.forEach(ref => {

			try {
				fs.unlinkSync(config.meta.path + '/.git/refs/remotes/origin/' + ref);
			} catch (err) {
			}

		});

		try {
			fs.rmdirSync(config.meta.path + '/.git/refs/remotes/origin');
		} catch (err) {
		}

	}

	let branches = config.branches || null;
	if (branches !== null) {

		Object.keys(branches).forEach(branch => {

			if (branches[branch].remote === name) {
				branches[branch].remote = 'github';
			}

		});

	}

};

const _status = function(orga, repo) {

	let path   = _SOFTWARE + '/' + orga + '/' + repo;
	let status = {
		branch:   'master',
		modified: true,
		heads:    {},
		remotes:  {}
	};


	try {

		let tmp = execSync('git status --porcelain', {
			cwd: path
		});

		let stdout = tmp.toString('utf8').trim();
		if (stdout === '') {
			status.modified = false;
		}

	} catch (err) {
	}

	try {

		let tmp = execSync('git branch', {
			cwd: path
		});

		let branch = tmp.toString('utf8').trim().split('\n').find(b => b.startsWith('*')) || null;
		if (branch !== null) {
			status.branch = branch.substr(1).trim();
		}

	} catch (err) {
	}

	try {

		let branches = fs.readdirSync(path + '/.git/refs/heads');
		if (branches.length > 0) {

			branches.forEach(branch => {

				let head = null;
				try {
					head = fs.readFileSync(path + '/.git/refs/heads/' + branch, 'utf8').trim();
				} catch (err) {
					head = null;
				}

				if (head !== null) {
					status.heads[branch] = head;
				}

			});

		}

	} catch (err) {
	}


	try {

		let remotes = fs.readdirSync(path + '/.git/refs/remotes');
		if (remotes.length > 0) {

			remotes.forEach(remote => {

				status.remotes[remote] = {};


				let branches = fs.readdirSync(path + '/.git/refs/remotes/' + remote);
				if (branches.length > 0) {

					branches.forEach(branch => {

						let buffer = null;

						try {
							buffer = fs.readFileSync(path + '/.git/refs/remotes/' + remote + '/' + branch);
						} catch (err) {
						}

						if (buffer !== null) {

							let ref = buffer.toString('utf8').trim();
							if (ref.startsWith('ref:')) {

								let tmp = null;

								try {
									tmp = fs.readFileSync(path + '/.git/' + ref.substr(4).trim());
								} catch (err) {
								}

								if (tmp !== null) {

									let hash = tmp.toString('utf8').trim();
									status.remotes[remote][branch] = hash;

								}

							} else {
								status.remotes[remote][branch] = ref;
							}

						}

					});

				}

			});

		}

	} catch (err) {
	}


	return status;

};

const _deserialize_config = function(buffer) {

	let config = {
		meta: {
			path: null,
			orga: null,
			repo: null
		},
		core: {},
		branches: {},
		remotes: {}
	};

	let errors  = [];
	let section = null;

	buffer.toString('utf8').split('\n').map(line => line.trim()).forEach(line => {

		if (line.startsWith('[') && line.endsWith(']')) {

			let tmp1 = line.substr(1, line.length - 2);
			if (tmp1 === 'core') {

				section = config.core;

			} else if (tmp1.startsWith('branch ')) {

				let tmp2 = tmp1.substr('branch '.length).trim();
				if (tmp2.startsWith('"') && tmp2.endsWith('"')) {

					let name = tmp2.substr(1, tmp2.length - 2);
					if (name.trim() !== '') {
						section = config.branches[name] = {};
					}

				}

			} else if (tmp1.startsWith('remote ')) {

				let tmp2 = tmp1.substr('remote '.length).trim();
				if (tmp2.startsWith('"') && tmp2.endsWith('"')) {

					let name = tmp2.substr(1, tmp2.length - 2);
					if (name.trim() !== '') {
						section = config.remotes[name] = {};
					}

				}

			} else {

				errors.push(line);
				section = null;

			}

		} else if (section === config.core) {

			if (line.includes(' = ')) {
				let [ key, val ] = line.split(' = ').map(v => v.trim());
				section[key] = val;
			}

		} else if (Object.values(config.branches).includes(section) || Object.values(config.remotes).includes(section)) {

			if (line.includes(' = ')) {
				let [ key, val ] = line.split(' = ').map(v => v.trim());
				section[key] = val;
			}

		} else if (line.trim() !== '') {
			errors.push(line);
		}

	});

	return config;

};

const _serialize_config = function(config) {

	let buffer = '';

	let core = config.core || null;
	if (core !== null) {

		buffer += '[core]\n';

		Object.keys(core).forEach(key => {
			buffer += '\t' + key + ' = ' + core[key] + '\n';
		});

	}

	let branches = config.branches || null;
	if (branches !== null) {

		Object.keys(branches).forEach(branch => {

			buffer += '[branch "' + branch + '"]\n';

			Object.keys(branches[branch]).forEach(key => {
				buffer += '\t' + key + ' = ' + branches[branch][key] + '\n';
			});

		});

	}

	let remotes = config.remotes || null;
	if (remotes !== null) {

		Object.keys(remotes).forEach(remote => {

			buffer += '[remote "' + remote + '"]\n';

			Object.keys(remotes[remote]).forEach(key => {
				buffer += '\t' + key + ' = ' + remotes[remote][key] + '\n';
			});

		});

	}

	if (buffer.length > 0) {
		return Buffer.from(buffer, 'utf8');
	}

	return null;

};

const _get_config = function(orga, repo) {

	let path = _SOFTWARE + '/' + orga + '/' + repo;
	let stat = null;
	try {
		stat = fs.lstatSync(path + '/.git/config');
	} catch (err) {
	}

	if (stat !== null && stat.isFile()) {

		let buffer = null;
		try {
			buffer = fs.readFileSync(path + '/.git/config', 'utf8');
		} catch (err) {
		}

		if (buffer !== null) {

			let config = _deserialize_config(buffer);
			if (config !== null) {

				config.meta = {
					path: path,
					orga: orga,
					repo: repo
				};

				return config;

			}

		}

	}

	return null;

};

const _set_config = function(orga, repo, config) {

	let path   = _SOFTWARE + '/' + orga + '/' + repo;
	let buffer = _serialize_config(config);
	if (buffer !== null) {

		let result = false;
		try {
			fs.writeFileSync(path + '/.git/config', buffer, 'utf8');
			result = true;
		} catch (err) {
			result = false;
		}

		return result;

	}

	return false;

};



/*
 * IMPLEMENTATION
 */

let user = (process.env.USER || '');
if (user.trim() === '') {

	console.error('No $USER environment variable set.');
	process.exit(1);

} else {

	fs.readdir(_SOFTWARE, (err, orgas) => {

		if (err) return;


		orgas.forEach(orga => {

			if (_ORGAS.includes(orga) === true) {

				fs.readdir(_SOFTWARE + '/' + orga, (err, repos) => {

					repos.filter(repo => {

						let stat = null;
						let git  = null;
						try {
							stat = fs.lstatSync(_SOFTWARE + '/' + orga + '/' + repo);
							git  = fs.lstatSync(_SOFTWARE + '/' + orga + '/' + repo + '/.git');
						} catch (err) {
						}

						if (
							stat !== null
							&& stat.isDirectory()
							&& git !== null
							&& git.isDirectory()
						) {
							return true;
						} else {
							console.warn('> Ignoring ' + orga + '/' + repo);
							return false;
						}

					}).forEach(repo => {

						let config = _get_config(orga, repo);
						let status = _status(orga, repo);

						if (config !== null && status !== null) {

							let change = false;
							let github = config.remotes.github || null;
							let gitlab = config.remotes.gitlab || null;

							if (github !== null) {

								if (github.url.startsWith('git@github.com') === false) {
									github.url = 'git@github.com:' + orga + '/' + repo + '.git';
									change = true;
								}

							} else {

								github = config.remotes.github = {
									url:   'git@github.com:' + orga + '/' + repo + '.git',
									fetch: '+refs/heads/*:refs/remotes/github/*'
								};
								change = true;

							}

							if (gitlab !== null) {

								if (gitlab.url.startsWith('git@gitlab.com') === false) {
									gitlab.url = 'git@gitlab.com:' + orga + '/' + repo + '.git';
									change = true;
								}

							} else {

								gitlab = config.remotes.gitlab = {
									url:   'git@gitlab.com:' + orga + '/' + repo + '.git',
									fetch: '+refs/heads/*:refs/remotes/gitlab/*'
								};
								change = true;

							}


							if (_FLAGS.includes('fix') === true) {

								let remote = config.remotes.origin || null;
								let refs   = Object.keys(status.remotes.origin || {});

								if (remote !== null || refs.length > 0) {
									_remove(config, status, 'origin');
									change = true;
								}

							}

							if (_FLAGS.includes('fix') === true) {

								let self = config.remotes[_SELF] || null;
								let refs = Object.keys(status.remotes[_SELF] || {});

								if (self !== null || refs.length > 0) {
									_remove(config, status, _SELF);
									change = true;
								}


								_PEERS.filter(peer => peer !== _SELF).forEach(peer => {

									let check = config.remotes[peer] || null;
									if (check === null) {

										config.remotes[peer] = {
											url:   'git://' + peer + '/' + orga + '/' + repo + '/.git',
											fetch: '+refs/heads/*:refs/remotes/' + peer + '/*'
										};
										change = true;

									}

								});

							}


							if (change === true) {

								console.info('> Writing  ' + orga + '/' + repo);

								let check = _set_config(orga, repo, config);
								if (check === true) {
									console.log('  OKAY');
								} else {
									console.warn('  FAIL');
								}

							}


							if (status.modified === true) {

								console.error('> Ignoring ' + orga + '/' + repo + ' (uncommited changes)');

							} else {

								console.info('> Fetching ' + orga + '/' + repo);

								let result = _fetch(config, status);
								if (result === true) {

									console.log('  OKAY');


									console.info('> Merging  ' + orga + '/' + repo);

									let result = _merge(config, status);
									if (result === true) {

										console.log('  OKAY');


										console.info('> Pushing  ' + orga + '/' + repo);

										let result = _push(config, status);
										if (result === true) {
											console.log('  OKAY');
										} else {
											console.error('  FAIL');
										}

									} else {
										console.warn('  FAIL');
									}

								} else {
									console.warn('  FAIL');
								}

							}


							if (_FLAGS.includes('backup')) {

								let result = _backup(config, status);
								if (result === true) {
									console.log('  OKAY');
								} else {
									console.error('  FAIL');
								}

							}

						}

					});

				});

			}

		});

	});

}

