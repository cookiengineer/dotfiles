
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
									archive: BACKUP + '/Software/Repositories/' + orga + '/' + repo + (state.changes.length > 0 ? ('@' + HOST) : '') + '.tar.xz',
									branch:  state.branch,
									changes: state.changes,
									name:    orga + '/' + repo,
									path:    SOFTWARE + '/' + orga + '/' + repo
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

		if (exists(BACKUP + '/Software/Repositories')) {

			let orgas = scan(BACKUP + '/Software/Repositories', false);
			if (orgas.length > 0) {

				orgas.forEach((orga) => {

					scan(BACKUP + '/Software/Repositories/' + orga, false).forEach((archive) => {

						if (
							archive.endsWith('tar.xz')
							&& exists(BACKUP + '/Software/Repositories/' + orga + '/' + archive, 'file')
						) {

							let repo = archive.substr(0, archive.length - 7);
							if (repo.includes('@')) {

								let host = repo.split('@').pop();
								if (host === HOST) {

									database['software'].push({
										archive: BACKUP + '/Software/Repositories/' + orga + '/' + archive,
										branch:  null,
										changes: [],
										name:    orga + '/' + repo.split('@').shift(),
										path:    SOFTWARE + '/' + orga + '/' + repo.split('@').shift()
									});

								}

							} else {

								database['software'].push({
									archive: BACKUP + '/Software/Repositories/' + orga + '/' + archive,
									branch:  null,
									changes: [],
									name:    orga + '/' + repo,
									path:    SOFTWARE + '/' + orga + '/' + repo
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
					console.info('software: ' + repo.name);
				}

			});
		}

	} else if (mode === 'restore') {

		if (database['software'].length > 0) {
			database['software'].forEach((repo) => {

				if (exists(repo.path, 'folder')) {
					console.warn('software: ' + repo.name + ' (already exists)');
				} else {
					console.info('software: ' + repo.name);
				}

			});
		}

	}


};

const _execute = (mode, database, callback) => {

	database['software'] = database['software'] || [];


	if (mode === 'backup') {

		database['software'].forEach((repo) => {

			let folder = repo.archive.split('/').slice(0, -1).join('/');
			if (exists(folder) === false) {
				mkdir(folder);
			}

			let archive = repo.archive;
			if (exists(archive) === true) {
				remove(archive);
			}

			console.log('software: archiving ' + repo.name + ' ...');

			let cwd    = SOFTWARE + '/' + repo.name.split('/').slice(0, -1).join('/');
			let source = repo.name.split('/').pop();

			exec('tar cvfJ "' + archive + '" -C "' + cwd + '" ' + source + ' 2>/dev/null', cwd);

		});

		callback(true);

	} else if (mode === 'restore') {

		database['software'].forEach((repo) => {

			if (exists(repo.path, 'folder') === false) {

				console.log('software: restoring ' + repo.name + ' ...');

				let archive = repo.archive;
				let cwd     = SOFTWARE + '/' + repo.name.split('/').slice(0, -1).join('/');

				exec('tar xJf "' + archive + '"', cwd);

			}

		});

		callback(true);

	}

};



export default {

	name:    'software',

	collect: _collect,
	details: _details,
	execute: _execute

};

