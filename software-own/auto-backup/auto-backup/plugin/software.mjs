
import { console                      } from '../console.mjs';
import { exists, mkdir, remove, scan  } from '../helper/fs.mjs';
import { status, read, write          } from '../helper/git.mjs';
import { exec, BACKUP, HOST, SOFTWARE } from '../helper/sh.mjs';



const GIT_PEERS = {
	'nuccy': 'ssh://cookiengineer@nuccy' + SOFTWARE + '/%orga%/%repo%/.git',
	'tinky': 'ssh://cookiengineer@tinky' + SOFTWARE + '/%orga%/%repo%/.git',
	'weep':  'ssh://cookiengineer@weep' + SOFTWARE + '/%orga%/%repo%/.git'
};



const _collect = (mode, database, callback) => {

	database['software'] = [];


	if (mode === 'backup') {

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

							let config = read(SOFTWARE + '/' + orga + '/' + repo);
							if (config !== null) {

								let change = false;
								let origin = config.remotes['origin'] || null;
								if (origin !== null && (origin.url.startsWith('git@github.com') || origin.url.startsWith('https://github.com'))) {

									config.remotes['github'] = {
										url:   'git@github.com:' + orga + '/' + repo,
										fetch: '+refs/heads/*:ref/remotes/github/*'
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
										url:   'git@github.com:' + orga + '/' + repo,
										fetch: '+refs/heads/*:ref/remotes/github/*'
									};

									change = true;

								}

								let gitlab = config.remotes['gitlab'] || null;
								if (gitlab === null) {

									config.remotes['gitlab'] = {
										url:   'git@gitlab.com:' + orga + '/' + repo,
										fetch: '+refs/heads/*:ref/remotes/gitlab/*'
									};

									change = true;

								}

								Object.keys(GIT_PEERS).filter((host) => {
									return host !== HOST;
								}).forEach((host) => {

									let remote = config.remotes[host] || null;
									if (remote === null) {

										let url = GIT_PEERS[host] || null;
										if (url !== null) {

											url = url.replace('%host%', host);
											url = url.replace('%orga%', orga);
											url = url.replace('%repo%', repo);

											config.remotes[host] = {
												url:   url,
												fetch: '+refs/heads/*:ref/remotes/' + host + '/*'
											};

											change = true;

										}

									}

								});

								if (change === true) {
									write(SOFTWARE + '/' + orga + '/' + repo, config);
								}

							}

							let state = status(SOFTWARE + '/' + orga + '/' + repo);
							if (state !== null) {

								database['software'].push({
									path:    SOFTWARE + '/' + orga + '/' + repo,
									name:    orga + '/' + repo,
									branch:  state.branch,
									changes: state.changes,
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

	} else if (mode === 'restore') {

		// TODO: Restore from archive files
		callback(false);

	}

};

const _details = (mode, database) => {

	database['software'] = database['software'] || [];


	if (mode === 'backup') {

		if (database['software'].length > 0) {
			database['software'].forEach((repo) => {

				if (repo.changes.length > 0) {
					console.warn('software: ' + repo.name + ' (local changes)');
				} else if (repo.remote === 'origin') {
					console.warn('software: ' + repo.name + ' (config mismatch)');
				} else {
					console.log('software: ' + repo.name);
				}

			});
		}

	} else if (mode === 'restore') {
	}

	// TODO: print details

};

const _execute = (mode, database, callback) => {

	database['software'] = database['software'] || [];

	if (mode === 'backup') {

		database['software'].forEach((repo) => {

			let archive = BACKUP + '/software/' + repo.name + '.tar.xz';
			let dirname = archive.split('/').slice(0, -1).join('/');
			let cwd     = SOFTWARE + '/' + repo.name.split('/').slice(0, -1).join('/');
			let source  = repo.name.split('/').pop();

			if (exists(dirname) === false) {
				mkdir(dirname);
			}

			if (exists(archive) === true) {
				remove(archive);
			}

			console.log('software: ' + repo.name);

			exec('tar cvfJ "' + archive + '" -C "' + cwd + '" ' + source + ' 2>/dev/null', {
				cwd: cwd
			});

		});

		callback(true);

	} else if (mode === 'restore') {

		// TODO: restore repositories from tar.xz file

	}

	callback(false);

};



export default {

	collect: _collect,
	details: _details,
	execute: _execute

};

