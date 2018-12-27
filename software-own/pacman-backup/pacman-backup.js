#!/usr/bin/env node

const _fs     = require('fs');
const _http   = require('http');
const _os     = require('os');
const _path   = require('path');
const _spawn  = require('child_process').spawnSync;
const _ARCH   = (arch => {
	if (arch === 'x64') return 'x86_64';
	if (arch === 'arm') return 'armv7h';
	return 'any';
})(process.arch);
const _ARGS   = Array.from(process.argv).slice(2);
const _CACHE  = [];
const _ACTION = /^(backup|cleanup|download|serve|upgrade)$/g.test((_ARGS[0] || '')) ? _ARGS[0] : null;
const _FOLDER = _ARGS.find(v => v.startsWith('/')) || null;
const _SERVER = _ARGS.find(v => (v.includes(':') || v.includes('.'))) || _ARGS.find(a => a !== _ACTION && a !== _FOLDER) || null;



/*
 * HELPERS
 */

const _config = (server) => `
[options]
HoldPkg           = pacman glibc
Architecture      = auto
IgnorePkg         = linux linux-headers linux-firmware
CheckSpace
SigLevel          = Required DatabaseOptional
LocalFileSigLevel = Optional

[core]
Server = http://${server}:15678

[extra]
Server = http://${server}:15678

[community]
Server = http://${server}:15678

[multilib]
Server = http://${server}:15678`;

const _copy = function(source, target, callback) {

	let called = false;
	let done   = (err) => {
		if (called === false) {
			called = true;
			callback(err);
		}
	};


	let read  = _fs.createReadStream(source);
	let write = _fs.createWriteStream(target);

	read.on('error',  err => done(err));
	write.on('error', err => done(err));
	write.on('close', _   => done(null));

	read.pipe(write);

};

const _diff = function(a, b) {

	let chunk_a = '';
	let chunk_b = '';
	let rest    = false;

	for (let i = 0, il = Math.max(a.length, b.length); i < il; i++) {

		let ch_a = a[i];
		let ch_b = b[i];

		if (rest === true || ch_a !== ch_b) {

			if (ch_a !== undefined) chunk_a += ch_a;
			if (ch_b !== undefined) chunk_b += ch_b;

			rest = true;

		}

	}

	return [ chunk_a, chunk_b ];

};

const _download = function(url, callback) {

	_http.get(url, res => {

		let buffers = [];

		res.setEncoding('binary');
		res.on('data', chunk => {
			buffers.push(Buffer.from(chunk, 'binary'));
		});
		res.on('end', _ => {
			callback(Buffer.concat(buffers));
		});

	}).on('error', err => {
		callback(null);
	});

};

const _mkdir = function(path) {

	let is_directory = false;

	try {

		let stat1 = _fs.lstatSync(path);
		if (stat1.isSymbolicLink()) {

			let tmp   = _fs.realpathSync(path);
			let stat2 = _fs.lstatSync(tmp);
			if (stat2.isDirectory()) {
				is_directory = true;
			}

		} else if (stat1.isDirectory()) {
			is_directory = true;
		}

	} catch (err) {

		if (err.code === 'ENOENT') {

			if (_mkdir(_path.dirname(path)) === true) {
				_fs.mkdirSync(path, 0o777 & (~process.umask()));
			}

			try {

				let stat2 = _fs.lstatSync(path);
				if (stat2.isSymbolicLink()) {

					let tmp   = _fs.realpathSync(path);
					let stat3 = _fs.lstatSync(tmp);
					if (stat3.isDirectory()) {
						is_directory = true;
					}

				} else if (stat2.isDirectory()) {
					is_directory = true;
				}

			} catch (err) {
			}

		}

	}

	return is_directory;

};

const _parse_pkgname = function(file) {

	if (file.endsWith('.pkg.tar.xz')) {
		file = file.substr(0, file.length - 11);
	}


	let arch = file.split('-').pop();
	let tmp  = file.split('-').slice(0, -1);

	let name    = '';
	let version = '';

	for (let t = 0, tl = tmp.length; t < tl; t++) {

		let chunk = tmp[t];
		let ch    = chunk.charAt(0);

		if (
			/^([A-Za-z0-9_+\.]+)$/g.test(chunk)
			&& /[A-Za-z]/g.test(ch)
		) {
			if (name.length > 0) name += '-';
			name += chunk;
		} else {
			if (version.length > 0) version += '-';
			version += chunk;
		}

	}


	let check = (name + '-' + version) === tmp.join('-');
	if (check === true) {

		return {
			name:    name,
			version: version,
			arch:    arch
		};

	} else {

		return null;

	}

};

const _read_pkgs = function(path, callback) {

	let cache = [];

	_fs.readdir(path, (err, files) => {

		if (!err) {

			files
				.filter(file => file.endsWith('.pkg.tar.xz'))
				.filter(file => file.includes('-'))
				.forEach(file => cache.push(file));

			callback(cache);

		}

	});

};

const _read_sync = function(path, callback) {

	let cache = [];

	_fs.readdir(path, (err, files) => {

		if (!err) {

			files
				.filter(file => file.endsWith('.db'))
				.forEach(file => cache.push(file));

			callback(cache);

		}

	});

};

const _remove = function(target, callback) {

	_fs.unlink(target, err => {
		callback(err ? err : null);
	});

};

const _serve = function(response, path) {

	_fs.readFile(path, (err, data) => {

		if (err) {
			res.writeHead(404, {});
			res.end();
		} else {
			res.writeHead(200, {
				'Content-Type': 'application/octet-stream',
				'Content-Length': Buffer.byteLength(data)
			});
			res.write(data);
			res.end();
		}

	});

};

const _sort_by_version = function(a, b) {

	let [ diff_a, diff_b ] = _diff(a, b);

	if (diff_a === '' && diff_b === '') {
		return 0;
	}


	// "+5+gf0d77228-1" vs. "-1"
	let special_a = diff_a.startsWith('+');
	let special_b = diff_b.startsWith('+');

	if (special_a === true && special_b === true) {

		return  0;

	} else if (special_a === true && diff_b === '-1') {

		return -1;

	} else if (special_b === true && diff_a === '-1') {

		return  1;

	} else if (special_a === false && special_b === false) {

		let dot_a = diff_a.includes('.');
		let dot_b = diff_b.includes('.');
		let cha_a = /[a-z]/g.test(diff_a);
		let cha_b = /[a-z]/g.test(diff_b);

		if (cha_a === true && cha_b === true) {

			let ver_a = diff_a.toLowerCase();
			let ver_b = diff_b.toLowerCase();

			return ver_a > ver_b ? -1 : 1;

		} else if (dot_a === true && dot_b === true) {

			let tmp_a = diff_a.split('.');
			let tmp_b = diff_b.split('.');
			let tl_a  = tmp_a.length;
			let tl_b  = tmp_b.length;
			let t_max = Math.min(tl_a, tl_b);

			for (let t = 0; t < t_max; t++) {

				let ch_a = parseInt(tmp_a[t], 10);
				let ch_b = parseInt(tmp_b[t], 10);

				if (!isNaN(ch_a) && !isNaN(ch_b)) {

					if (ch_a > ch_b) {
						return -1;
					} else if (ch_b > ch_a) {
						return  1;
					}

				}

			}

		} else if (
			(dot_a === true && dot_b === false)
			|| (dot_a === false && dot_b === true)
		) {

			let tmp_a = diff_a.split('-')[0];
			let tmp_b = diff_b.split('-')[0];

			let ver_a = parseInt(tmp_a, 10);
			if (tmp_a.includes('.')) {
				ver_a = parseFloat(tmp_a, 10);
			}

			let ver_b = parseInt(tmp_b, 10);
			if (tmp_b.includes('.')) {
				ver_b = parseFloat(tmp_b, 10);
			}

			return ver_a > ver_b ? -1 : 1;

		} else {

			let ch_a = parseInt(diff_a, 10);
			let ch_b = parseInt(diff_b, 10);

			if (ch_a > ch_b) {
				return -1;
			} else if (ch_b > ch_a) {
				return  1;
			}

		}

	}


	return 0;

};

const _write = function(target, buffer, callback) {

	let encoding = 'binary';

	if (typeof buffer === 'string') {
		encoding = 'utf8';
	}

	_fs.writeFile(target, buffer, encoding, (err) => {

		if (!err) {
			callback(true);
		} else {
			callback(false);
		}

	});

};



/*
 * IMPLEMENTATION
 */

if (_ACTION === 'backup' && _FOLDER !== null) {

	_mkdir(_FOLDER + '/pkgs');
	_mkdir(_FOLDER + '/sync');

	_read_pkgs(_FOLDER + '/pkgs', cache => {

		_read_pkgs('/var/cache/pacman/pkg', packages => {

			packages
				.filter(file => cache.includes(file) === false)
				.forEach(file => {

					_copy('/var/cache/pacman/pkg/' + file, _FOLDER + '/pkgs/' + file, err => {
						if (!err) console.log(':: archived pkgs/' + file);
					});

				});

		});

	});

	_read_sync('/var/lib/pacman/sync', databases => {

		databases
			.filter(file => file !== 'testing.db')
			.forEach(file => {

				_copy('/var/lib/pacman/sync/' + file, _FOLDER + '/sync/' + file, err => {
					if (!err) console.log(':: archived sync/' + file);
				});

			});

	});

} else if (_ACTION === 'cleanup') {

	let pkgs_folder = '/var/cache/pacman/pkg';

	if (_FOLDER !== null) {
		pkgs_folder = _FOLDER + '/pkgs';
		_mkdir(_FOLDER + '/pkgs');
	}


	_read_pkgs(pkgs_folder, cache => {

		let database = {
			'any':    {},
			'armv7h': {},
			'x86_64': {},
			'x86':    {}
		};

		cache.forEach(file => {

			let pkg = _parse_pkgname(file);
			if (pkg === null) {

				console.log(':: Cannot recognize version scheme of ' + file);

			} else {

				let entry = database[pkg.arch][pkg.name] || null;
				if (entry === null) {

					database[pkg.arch][pkg.name] = {
						arch:     pkg.arch,
						name:     pkg.name,
						versions: [ pkg.version ]
					};

				} else {
					entry.versions.push(pkg.version);
				}

			}

		});

		for (let arch in database) {

			let tree = Object.values(database[arch]);
			if (tree.length > 0) {

				console.log(':: Purging cache for "' + arch + '"');

				tree
					.filter(pkg => pkg.versions.length > 1)
					.forEach(pkg => {

						pkg.versions
							.sort(_sort_by_version)
							.slice(1)
							.forEach(version => {

								_remove(pkgs_folder + '/' + pkg.name + '-' + version + '-' + pkg.arch + '.pkg.tar.xz', err => {
									if (!err) console.log(':: purged ' + pkg.name + '-' + version);
								});

							});

					});

			}

		}

	});

} else if (_ACTION === 'download' && _SERVER !== null) {

	let pkgs_folder = '/var/cache/pacman/pkg';
	let sync_folder = '/var/lib/pacman/sync';

	if (_FOLDER !== null) {
		pkgs_folder = _FOLDER + '/pkgs';
		sync_folder = _FOLDER + '/sync';
		_mkdir(_FOLDER + '/pkgs');
		_mkdir(_FOLDER + '/sync');
	}


	let on_download_complete = (pkgs_folder, packages) => {

		let upgrades = packages.filter(pkg => pkg._success === true).map(pkg => pkg.file);
		if (upgrades.length > 0) {
			console.log('\n:: Execute this to install upgrades from local package cache:');
			console.log('\ncd "' + pkgs_folder + '"; sudo pacman -U ' + upgrades.join(' ') + ';');
		}

		let downloads = packages.filter(pkg => pkg._success === false).map(pkg => pkg.name);
		if (downloads.length > 0) {
			console.log('\n:: Execute this to download upgrades into local package cache:');
			console.log('\ncd "' + pkgs_folder + '"; sudo pacman -Sw --cachedir "' + pkgs_folder + '" ' + downloads.join(' ') + ';');
		}

	};


	_write('/tmp/pacman-backup.conf', _config(_SERVER), result => {

		if (result === true) {

			let sync_handle = _spawn('pacman', [ '-Sy', '--config', '/tmp/pacman-backup.conf' ], {
				cwd: sync_folder
			});

			let stderr = (sync_handle.stderr || '').toString().trim();

			if (stderr.length === 0) {

				let pkgs_handle = _spawn('pacman', [ '-Sup', '--print-format', '%n /// %v' ], {
					cwd: pkgs_folder
				});

				let stdout   = (pkgs_handle.stdout || '').toString().trim();
				let stderr   = (pkgs_handle.stderr || '').toString().trim();
				let packages = [];

				if (stderr.length === 0) {

					_read_pkgs(pkgs_folder, cache => {

						stdout
							.split('\n')
							.filter(line => line.startsWith('::') === false)
							.map(line => ({
								name:    line.split(' /// ')[0],
								version: line.split(' /// ')[1]
							})).filter(pkg => {

								let file_arch = pkg.name + '-' + pkg.version + '-' + _ARCH + '.pkg.tar.xz';
								let file_any  = pkg.name + '-' + pkg.version + '-any.pkg.tar.xz';

								if (cache.includes(file_arch) === true) {

									packages.push({
										_success: true,
										arch:     _ARCH,
										file:     file_arch,
										name:     pkg.name,
										version:  pkg.version
									});

								} else if (cache.includes(file_any) === true) {

									packages.push({
										_success: true,
										arch:     'any',
										file:     file_any,
										name:     pkg.name,
										version:  pkg.version
									});

								} else {

									packages.push({
										_success: false,
										arch:     null,
										file:     null,
										name:     pkg.name,
										version:  pkg.version
									});

								}

							});

					});


					setTimeout(_ => {

						packages.filter(pkg => pkg._success === false).forEach(pkg => {

							let handle = _spawn('pacman', [ '-Si', pkg.name ], {
								cwd: pkgs_folder
							});

							let stdout = (handle.stdout || '').toString().trim();
							if (stdout.length > 0) {

								let arch = (stdout.split('\n').find(line => line.startsWith('Architecture')) || '').split(':').pop().trim();
								if (arch !== null) {
									pkg.arch = arch;
									pkg.file = pkg.name + '-' + pkg.version + '-' + pkg.arch + '.pkg.tar.xz';
								}

							}

						});


						let invalid_arch = packages.filter(pkg => pkg.file === null);
						if (invalid_arch.length > 0) {
							invalid_arch.forEach(pkg => console.log(':: Database query for ' + pkg.name + ' failed.'));
						}


						packages = packages.filter(pkg => pkg.file !== null);


						let downloads = packages.filter(pkg => pkg._success === false);

						downloads.forEach((pkg, d) => {

							_download('http://' + _SERVER + ':15678/' + pkg.file, buffer => {

								if (buffer !== null && buffer.length > 0) {

									_write(pkgs_folder + '/' + pkg.file, buffer, err => {

										if (!err) console.log(':: downloaded ' + pkg.name + '-' + pkg.version);
										pkg._success = true;

										if (d === downloads.length - 1) {
											on_download_complete(pkgs_folder, packages);
										}

									});

								} else {

									pkg._success = false;

									if (d === downloads.length - 1) {
										on_download_complete(pkgs_folder, packages);
									}

								}

							});

						});

					}, 500);

				}

			} else {

				console.log(':: Database synchronization failed.');
				console.log(stderr);

				process.exit(1);

			}

		}

	});

} else if (_ACTION === 'serve') {

	let pkgs_folder = '/var/cache/pacman/pkg';
	let sync_folder = '/var/lib/pacman/sync';

	if (_FOLDER !== null) {
		pkgs_folder = _FOLDER + '/pkgs';
		sync_folder = _FOLDER + '/sync';
		_mkdir(_FOLDER + '/pkgs');
		_mkdir(_FOLDER + '/sync');
	}


	let database = [];

	_fs.readdir(sync_folder, (err, files) => {

		if (!err) {
			files.filter(file => file.endsWith('.db')).forEach(file => database.push(file));
		}

	});


	let server = _http.createServer((req, res) => {

		let file = req.url.split('/').pop();
		if (file.endsWith('.tar.xz')) {
			_serve(res, pkgs_folder + '/' + file);
		} else if ((file.endsWith('.db') || file.endsWith('.db.sig')) && database.includes(file)) {
			_serve(res, sync_folder + '/' + file);
		} else {
			res.writeHead(404, {});
			res.end();
		}

	});

	server.listen(15678);


	let interfaces = Object.values(_os.networkInterfaces()).flat().filter(iface => iface.internal === false);
	if (interfaces.length > 0) {

		console.log('\n:: Execute this on another machine to download from local package cache:');
		console.log('');

		interfaces.forEach(iface => {
			console.log('pacman-backup download /tmp/pacman-backup-cache "' + iface.address + '";');
		});

	} else {

		console.log('\n:: Execute this on another machine to download from local package cache:');
		console.log('\npacman-backup download /tmp/pacman-backup-cache this-machines-address;');

	}

} else if (_ACTION === 'upgrade') {

	let pkgs_folder = '/var/cache/pacman/pkg';

	if (_FOLDER !== null) {
		pkgs_folder = _FOLDER + '/pkgs';
		_mkdir(_FOLDER + '/pkgs');
	}


	let handle = _spawn('pacman', [ '-Sup', '--print-format', '%n /// %v' ], {
		cwd: pkgs_folder
	});

	let stdout = (handle.stdout || '').toString().trim();
	let stderr = (handle.stderr || '').toString().trim();

	if (stderr.length === 0) {

		_read_pkgs(pkgs_folder, cache => {

			let upgrades  = [];
			let downloads = [];

			stdout
				.split('\n')
				.filter(line => line.startsWith('::') === false)
				.map(line => ({
					name:    line.split(' /// ')[0],
					version: line.split(' /// ')[1]
				})).filter(pkg => {

					let file_arch = pkg.name + '-' + pkg.version + '-' + _ARCH + '.pkg.tar.xz';
					let file_any  = pkg.name + '-' + pkg.version + '-any.pkg.tar.xz';

					if (cache.includes(file_arch)) {
						upgrades.push(file_arch);
					} else if (cache.includes(file_any)) {
						upgrades.push(file_any);
					} else {
						downloads.push(pkg.name);
					}

				});


			if (upgrades.length > 0) {
				console.log('\n:: Execute this to install upgrades from local package cache:');
				console.log('\ncd "' + pkgs_folder + '"; sudo pacman -U ' + upgrades.join(' ') + ';');
			}

			if (downloads.length > 0) {
				console.log('\n:: Execute this to download upgrades into local package cache:');
				console.log('\ncd "' + pkgs_folder + '"; sudo pacman -Sw --cachedir "' + pkgs_folder + '" ' + downloads.join(' ') + ';');
			}

		});

	}

} else {

	console.log('pacman-backup');
	console.log('Backup tool for off-the-grid upgrades via portable USB sticks.');
	console.log('');
	console.log('Usage: pacman-backup [Action] [Folder]');
	console.log('');
	console.log('Usage Notes:');
	console.log('');
	console.log('    Folder is assumed write-able by the current user.');
	console.log('    Remember to "sync" after backup or clean.');
	console.log('');
	console.log('Available Actions:');
	console.log('');
	console.log('    backup     copies local package cache to folder');
	console.log('    cleanup    removes outdated packages from folder');
	console.log('    upgrade    prints pacman command to upgrade from folder');
	console.log('');
	console.log('    serve      serves packages');
	console.log('    download   downloads packages to folder from server');
	console.log('');
	console.log('USB Example:')
	console.log('');
	console.log('    # 1: Machine with internet connection');
	console.log('    sudo pacman -Sy;');
	console.log('    sudo pacman -Suw;');
	console.log('    pacman-backup backup /run/media/cookiengineer/pacman-usbstick;');
	console.log('    pacman-backup cleanup /run/media/cookiengineer/pacman-usbstick;');
	console.log('    sync;');
	console.log('');
	console.log('    # 2: User walks to other machine without internet connection');
	console.log('    #    and inserts same USB stick there ...');
	console.log('');
	console.log('    # 3: Machine without internet connection');
	console.log('    sudo cp /run/media/cookiengineer/pacman-usbstick/sync/*.db /var/lib/pacman/sync/;');
	console.log('    pacman-backup upgrade /run/media/cookiengineer/pacman-usbstick;');
	console.log('');
	console.log('LAN Example:')
	console.log('');
	console.log('    # 1: Machine with internet connection');
	console.log('    #    with example IP 192.168.0.10');
	console.log('    sudo pacman -Sy;');
	console.log('    sudo pacman -Suw;');
	console.log('    pacman-backup serve;');
	console.log('');
	console.log('    # 2: User walks to other machine with LAN connection');
	console.log('    #    and downloads package cache from pacman server ...');
	console.log('');
	console.log('    # 3: Machine without internet connection');
	console.log('    #    "Server = http://192.168.0.10:15678" in /etc/pacman.d/mirrorlist');
	console.log('    sudo pacman-backup download 192.168.0.10');
	console.log('    sudo pacman-backup upgrade');
	console.log('');

}

