
import https from 'https';


import { console                            } from '../console.mjs';
import { isArray, isObject, isString        } from '../POLYFILLS.mjs';
import { exists, mkdir, remove, scan        } from '../helper/fs.mjs';
import { clone, status, read, write         } from '../helper/git.mjs';
import { exec, BACKUP, HOST, SOFTWARE, USER } from '../helper/sh.mjs';
import { queue                              } from '../helper/io.mjs';



const GIT_ORGAS = [
	'Artificial-Engineering',
	'Artificial-University',
	'cookiengineer',
	'polyfillr',
	'tholian-network'
];

const GIT_PEERS = [{
	host: 'nuccy',
	url:  'ssh://' + USER + '@nuccy' + SOFTWARE + '/%orga%/%repo%/.git'
}, {
	host: 'tinky',
	url:  'ssh://' + USER + '@tinky' + SOFTWARE + '/%orga%/%repo%/.git'
}, {
	host: 'weep',
	url:  'ssh://' + USER + '@weep' + SOFTWARE + '/%orga%/%repo%/.git'
}];


const query = (orga, callback) => {

	let request = https.request({
		hostname: 'api.github.com',
		path:     '/users/' + orga + '/repos',
		method:   'GET',
		headers:  {
			'authorization': 'b8511b48b732444d5c7b26e4a208757accd15550',
			'content-type':  'application/json',
			'user-agent':    'cookiengineer\'s dotfiles'
		}
	}, (response) => {

		let raw = '';

		response.setEncoding('utf8');

		response.on('data', (ch) => {
			raw += ch;
		});

		response.on('end', () => {

			let data = null;
			try {
				data = JSON.parse(raw);
			} catch (err) {
				data = null;
			}

			if (isArray(data)) {

				let repos = [];

				data.forEach((entry) => {

					if (
						isString(entry['name'])
						&& isString(entry['default_branch'])
					) {

						let repo   = entry['name'];
						let branch = entry['default_branch'];

						repos.push({
							backup:  BACKUP + '/Projects/Software/' + orga + '/' + repo + '.tar.xz',
							branch:  branch,
							changes: null,
							name:    orga + '/' + repo,
							online:  'git@github.com:' + orga + '/' + repo + '.git',
							origin:  SOFTWARE + '/' + orga + '/' + repo
						});

					}

				});

				callback(repos);

			} else if (isObject(data) && isString(data.message)) {

				console.error('GitHub API: ' + data.message);

				callback(null);

			} else {

				callback(null);

			}

		});

	}).on('error', () => {
		callback(null);
	});

	request.end();

};

const fix_config = (orga, repo) => {

	let config = read(SOFTWARE + '/' + orga + '/' + repo);
	if (config !== null) {

		let change = false;
		let origin = config.remotes['origin'] || null;
		if (origin !== null && (origin.url.startsWith('git@github.com') || origin.url.startsWith('https://github.com'))) {

			config.remotes['github'] = {
				url:   'git@github.com:' + orga + '/' + repo + '.git',
				fetch: '+refs/heads/*:refs/remotes/github/*'
			};

			delete config.remotes['origin'];

			Object.values(config.branches).forEach((branch) => {

				if (branch.remote === 'origin') {
					delete branch.remote;
				}

			});

			change = true;

		}

		let master = config.branches['master'] || null;
		if (master === null) {

			config.branches['master'] = {
				merge: 'refs/heads/master'
			};

			change = true;

		}

		let github = config.remotes['github'] || null;
		if (github === null) {

			config.remotes['github'] = {
				url:   'git@github.com:' + orga + '/' + repo + '.git',
				fetch: '+refs/heads/*:refs/remotes/github/*'
			};

			change = true;

		}

		let gitlab = config.remotes['gitlab'] || null;
		if (gitlab === null) {

			config.remotes['gitlab'] = {
				url:   'git@gitlab.com:' + orga + '/' + repo + '.git',
				fetch: '+refs/heads/*:refs/remotes/gitlab/*'
			};

			change = true;

		}

		GIT_PEERS.filter((peer) => peer.host !== HOST).forEach((peer) => {

			let remote = config.remotes[peer.host] || null;
			if (remote === null) {

				let url = peer.url || null;
				if (url !== null) {

					url = url.replace('%host%', peer.host);
					url = url.replace('%orga%', orga);
					url = url.replace('%repo%', repo);

					config.remotes[peer.host] = {
						url:   url,
						fetch: '+refs/heads/*:refs/remotes/' + peer.host + '/*'
					};

					change = true;

				}

			}

		});

		if (change === true) {
			write(SOFTWARE + '/' + orga + '/' + repo, config);
		}

	}

};



const PLUGIN = {

	name: 'software',

	init: {

		collect: (database, callback) => {

			queue([ query ], GIT_ORGAS.slice(), (results) => {

				results.forEach((repos) => {

					repos.forEach((repo) => {

						if (exists(SOFTWARE + '/' + repo.name + '/.git', 'folder') === false) {
							database.push(repo);
						}

					});

				});

				if (database.length > 0) {
					callback(true);
				} else {
					callback(false);
				}

			});

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				database.forEach((repo) => {

					if (exists(repo.origin) === false) {
						mkdir(repo.origin);
					}

					console.log(PLUGIN.name + ': cloning ' + repo.name + ' ...');

					let result = clone(repo.online, repo.origin);
					if (result === true) {
						fix_config(repo.name.split('/').shift(), repo.name.split('/').pop());
					}

				});

				callback(true);

			} else {

				callback(false);

			}

		}

	},

	backup: {

		collect: (database, callback) => {

			if (exists(SOFTWARE)) {

				let orgas = scan(SOFTWARE, false).filter((orga) => {

					if (
						exists(SOFTWARE + '/' + orga, 'folder')
						&& orga.startsWith('__') === false
					) {
						return true;
					}

					return false;

				});

				if (orgas.length > 0) {

					orgas.forEach((orga) => {

						scan(SOFTWARE + '/' + orga, false).forEach((repo) => {

							if (
								exists(SOFTWARE + '/' + orga + '/' + repo)
								&& exists(SOFTWARE + '/' + orga + '/' + repo + '/.git')
								&& repo.startsWith('__') === false
							) {

								// Ensure correctness of remotes
								fix_config(orga, repo);


								let state = status(SOFTWARE + '/' + orga + '/' + repo);
								if (state !== null) {

									database.push({
										backup:  BACKUP + '/Projects/Software/' + orga + '/' + repo + (state.changes.length > 0 ? ('@' + HOST) : '') + '.tar.xz',
										branch:  state.branch,
										changes: state.changes,
										name:    orga + '/' + repo,
										origin:  SOFTWARE + '/' + orga + '/' + repo
									});

								}

							}

						});

					});

					callback(true);

				} else {

					callback(false);

				}

			} else {

				callback(false);

			}


		},

		details: (database) => {

			if (database.length > 0) {
				database.forEach((entry) => {

					if (entry.changes.length > 0) {
						console.warn(PLUGIN.name + ': ' + entry.name + ' (local changes)');
					} else if (entry.remote === 'origin') {
						console.warn(PLUGIN.name + ': ' + entry.name + ' (config mismatch)');
					} else {
						console.info(PLUGIN.name + ': ' + entry.name);
					}

				});
			}

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				database.forEach((repo) => {

					let folder = repo.backup.split('/').slice(0, -1).join('/');
					if (exists(folder) === false) {
						mkdir(folder);
					}

					if (exists(repo.backup) === true) {
						remove(repo.backup);
					}

					console.log(PLUGIN.name + ': archiving ' + repo.name + ' ...');

					let cwd    = SOFTWARE + '/' + repo.name.split('/').slice(0, -1).join('/');
					let source = repo.name.split('/').pop();

					exec('tar cvfJ "' + repo.backup + '" -C "' + cwd + '" ' + source + ' 2>/dev/null', cwd);

				});

				callback(true);

			} else {

				callback(false);

			}

		}

	},

	restore: {

		collect: (database, callback) => {

			if (exists(BACKUP + '/Projects/Software')) {

				let orgas = scan(BACKUP + '/Projects/Software', false);
				if (orgas.length > 0) {

					orgas.forEach((orga) => {

						scan(BACKUP + '/Projects/Software/' + orga, false).forEach((archive) => {

							if (
								archive.endsWith('tar.xz')
								&& exists(BACKUP + '/Projects/Software/' + orga + '/' + archive, 'file')
							) {

								let repo = archive.substr(0, archive.length - 7);
								if (repo.includes('@')) {

									let host = repo.split('@').pop();
									if (host === HOST) {

										database.push({
											backup:  BACKUP + '/Projects/Software/' + orga + '/' + archive,
											branch:  null,
											changes: [],
											name:    orga + '/' + repo.split('@').shift(),
											origin:  SOFTWARE + '/' + orga + '/' + repo.split('@').shift()
										});

									}

								} else {

									database.push({
										backup:  BACKUP + '/Projects/Software/' + orga + '/' + archive,
										branch:  null,
										changes: [],
										name:    orga + '/' + repo,
										origin:  SOFTWARE + '/' + orga + '/' + repo
									});

								}

							}

						});

					});

					callback(true);

				} else {

					callback(false);

				}

			} else {

				callback(false);

			}

		},

		details: (database) => {

			if (database.length > 0) {
				database.forEach((entry) => {

					if (exists(entry.origin, 'folder') === true) {
						console.warn(PLUGIN.name + ': ' + entry.name + ' (already exists)');
					} else {
						console.info(PLUGIN.name + ': ' + entry.name);
					}

				});
			}

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				database.forEach((repo) => {

					if (exists(repo.origin, 'folder') === false) {

						console.log(PLUGIN.name + ': restoring ' + repo.name + ' ...');

						let cwd = SOFTWARE + '/' + repo.name.split('/').slice(0, -1).join('/');

						exec('tar xJf "' + repo.backup + '"', cwd);

					}

				});

				callback(true);

			} else {

				callback(false);

			}

		}

	}

};


export default PLUGIN;

