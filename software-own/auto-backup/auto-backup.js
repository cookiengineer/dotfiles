
const fs       = require('fs');
const execSync = require('child_process').execSync;
const _ROOT    = '/home/' + process.env.USER + '/Software';
const _FLAGS   = Array.from(process.argv).filter(v => v.startsWith('--')).map(v => v.substr(2));



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

const _pretty_path = function(path) {

	if (path.startsWith('/home/' + process.env.USER) === true) {
		path = '~' + path.substr(('/home/' + process.env.USER).length);
	}

	return path;

};

const _deserialize_config = function(path, config) {

	let data = {
		core:   {},
		branch: {},
		remote: {}
	};
	let errors = [];


	let section = null;

	config.split('\n').map(line => line.trim()).forEach(line => {

		if (line.startsWith('[') && line.endsWith(']')) {

			let tmp1 = line.substr(1, line.length - 2);
			if (tmp1 === 'core') {

				section = data.core;

			} else if (tmp1.startsWith('branch ')) {

				let tmp2 = tmp1.substr('branch '.length).trim();
				if (tmp2.startsWith('"') && tmp2.endsWith('"')) {

					let name = tmp2.substr(1, tmp2.length - 2);
					if (name.trim() !== '') {
						section = data.branch[name] = {};
					}

				}

			} else if (tmp1.startsWith('remote ')) {

				let tmp2 = tmp1.substr('remote '.length).trim();
				if (tmp2.startsWith('"') && tmp2.endsWith('"')) {

					let name = tmp2.substr(1, tmp2.length - 2);
					if (name.trim() !== '') {
						section = data.remote[name] = {};
					}

				}

			} else {

				errors.push(line);
				section = null;

			}

		} else if (section === data.core) {

			if (line.includes(' = ')) {
				let [ key, val ] = line.split(' = ').map(v => v.trim());
				section[key] = val;
			}

		} else if (
			Object.values(data.branch).includes(section)
			|| Object.values(data.remote).includes(section)
		) {

			if (line.includes(' = ')) {
				let [ key, val ] = line.split(' = ').map(v => v.trim());
				section[key] = val;
			}

		} else if (line.trim() !== '') {
			errors.push(line);
		}

	});


	if (errors.length > 0) {
		console.warn('Invalid git config "' + path + '".');
		errors.forEach(err => console.warn(err));
	}

	return data;

};

const _serialize_config = function(data) {

	let config = '';

	let core = data.core || null;
	if (core !== null) {

		config += '[core]\n';

		Object.keys(core).forEach(key => {
			config += '\t' + key + ' = ' + core[key] + '\n';
		});

	}

	let branches = data.branch || null;
	if (branches !== null) {

		Object.keys(branches).forEach(branch => {

			config += '[branch "' + branch + '"]\n';

			Object.keys(branches[branch]).forEach(key => {
				config += '\t' + key + ' = ' + branches[branch][key] + '\n';
			});

		});

	}

	let remotes = data.remote || null;
	if (remotes !== null) {

		Object.keys(remotes).forEach(remote => {

			config += '[remote "' + remote + '"]\n';

			Object.keys(remotes[remote]).forEach(key => {
				config += '\t' + key + ' = ' + remotes[remote][key] + '\n';
			});

		});

	}

	return config;

};

const _read_config = function(path) {

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

			let data = _deserialize_config(path, buffer.toString('utf8'));
			if (data !== null) {
				return data;
			}

		}

	}


	return null;

};

const _write_config = function(path, config) {

	console.info(' > Fix git config at "' + _pretty_path(path) + '"');

	let buffer = null;

	let data = _serialize_config(config);
	if (data !== '') {

		let buffer = Buffer.from(data, 'utf8');
		if (buffer instanceof Buffer) {

			let result = false;
			try {
				fs.writeFileSync(path + '/.git/config', buffer, 'utf8');
				result = true;
			} catch (err) {
				result = false;
			}

			return result;

		}

	}


	return false;

};

const _get_status = function(path) {

	let status = {
		modified: true,
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



/*
 * IMPLEMENTATION
 */

let user = (process.env.USER || '');
if (user.trim() === '') {

	console.error('No $USER environment variable set.');
	process.exit(1);

} else {

	fs.readdir(_ROOT, (err, orgas) => {

		if (err) return;


		orgas.forEach(orga => {

			if (_ORGAS.includes(orga) === true) {

				fs.readdir(_ROOT + '/' + orga, (err, repos) => {

					repos.filter(repo => {

						let stat = null;
						let git  = null;
						try {
							stat = fs.lstatSync(_ROOT + '/' + orga + '/' + repo);
							git  = fs.lstatSync(_ROOT + '/' + orga + '/' + repo + '/.git');
						} catch (err) {
						}

						if (
							stat !== null
							&& stat.isDirectory()
							&& git !== null
							&& git.isDirectory()
						) {
							return true;
						}


						return false;

					}).forEach(repo => {

						let config = _read_config(_ROOT + '/' + orga + '/' + repo);
						let status = _get_status(_ROOT + '/' + orga + '/' + repo);

						if (config !== null && status !== null) {

							let change = false;
							let github = config.remote.github || null;
							let gitlab = config.remote.gitlab || null;

							if (github !== null) {

								if (github.url.startsWith('git@github.com') === false) {
									github.url = 'git@github.com:' + orga + '/' + repo + '.git';
									change = true;
								}

							} else {

								github = config.remote.github = {
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

								gitlab = config.remote.gitlab = {
									url:   'git@gitlab.com:' + orga + '/' + repo + '.git',
									fetch: '+refs/heads/*:refs/remotes/gitlab/*'
								};
								change = true;

							}


							if (_FLAGS.includes('remove-origin') === true) {

								let remote = config.remote.origin || null;
								if (remote !== null) {
									delete config.remote.origin;
									change = true;
								}

								let refs = Object.keys(status.remotes.origin || {});
								if (refs.length > 0) {

									delete status.remotes.origin;
									change = true;

									refs.forEach(ref => {

										try {
											fs.unlinkSync(_ROOT + '/' + orga + '/' + repo + '/.git/refs/remotes/origin/' + ref);
										} catch (err) {
										}

									});

									try {
										fs.rmdirSync(_ROOT + '/' + orga + '/' + repo + '/.git/refs/remotes/origin');
									} catch (err) {
									}

								}

							}

							if (_FLAGS.includes('add-peers') === true) {

								_PEERS.forEach(peer => {

									let check = config.remote[peer] || null;
									if (check === null) {

										config.remote[peer] = {
											url:   'git://' + peer + '/' + orga + '/' + repo + '/.git',
											fetch: '+refs/heads/*:refs/remotes/' + peer + '/*'
										};
										change = true;

									}

								});


							}


							if (change === true) {
								_write_config(_ROOT + '/' + orga + '/' + repo, config);
							}


							if (status.modified === false) {

								console.info(orga + '/' + repo);
								// console.log(status);

							} else {

								console.error(orga + '/' + repo);
								// console.log(status);

							}

							// TODO:
							// 1. fetch from github and gitlab
							// 2. push to github and gitlab (and bitbucket)
							// 3.


							// TODO: Fetch afterwards
							// console.log('to fetch or not to fetch?', orga + '/' + repo);

						}

					});

				});

			} else {

				fs.readdir(_ROOT + '/' + orga, (err, repos) => {
					// TODO: Only pull
				});

			}

		});

	});

}

