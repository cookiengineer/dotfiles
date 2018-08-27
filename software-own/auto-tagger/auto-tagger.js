#!/usr/bin/env node

const fs    = require('fs');
const exec  = require('child_process').exec;
const _ROOT = '/home/' + process.env.USER + '/Music';
const _META = {};
const _TODO = [];



/*
 * HELPERS
 */

const _autotag_file = function(path, data) {

	let cmd = [ 'id3v2' ];

	// XXX: id3v2 cannot remove and
	// incrementally set in one cmd :-/
	// cmd.push('--delete-all');

	if (data.album  != null) cmd.push('--album "'  + data.album  + '"');
	if (data.genre  != null) cmd.push('--genre "'  + data.genre  + '"');
	if (data.track  != null) cmd.push('--track "'  + data.track  + '"');
	if (data.artist != null) cmd.push('--artist "' + data.artist + '"');
	if (data.title  != null) cmd.push('--song "'   + data.title  + '"');

	cmd.push('"' + path + '"');

	// XXX: First delete all tags
	exec('id3v2 --delete-all "' + path + '"', function(err, stdout, stderr) {

		if (err) return;


		// XXX: Then set new tags
		exec(cmd.join(' '), function(err, stdout, stderr) {

			if (err) return;

			if (stdout.trim() !== '' || stderr.trim() !== '') {
				console.log('id3v2 failed tagging "' + path + '".');
			}

		});

	});

};

const _autoparse_data = function(album, file) {

	let data = {};

	let tmp1 = file.substr(0, file.length - 4);
	let tmp2 = tmp1.split('-').map(val => val.trim());
	if (tmp2.length === 2) {

		let artist = tmp2[0];
		let title  = tmp2[1];
		let track  = null;

		let i1 = artist.indexOf('.');
		if (i1 > 0 && i1 < 5) {

			let tmp3 = artist.substr(0, i1).trim();
			if (/([0-9]+)/g.test(tmp3)) {
				track  = tmp3.trim();
				artist = artist.substr(i1 + 1);
			}

		}

		// XXX: We use Genre as Album here
		if (album  != null) data.genre  = album;

		if (album  != null) data.album  = album;
		if (track  != null) data.track  = track;
		if (artist != null) data.artist = artist;
		if (title  != null) data.title  = title;


	}

	return data;

};



/*
 * IMPLEMENTATION
 */

let user = (process.env.USER || '');
if (user.trim() === '') {

	console.error('No $USER environment variable set.');
	process.exit(1);

} else {

	try {

		let stat = fs.lstatSync(_ROOT + '/.auto-tagger.json');
		if (stat.isFile()) {

			let buffer = fs.readFileSync(_ROOT + '/.auto-tagger.json', 'utf8');
			if (buffer !== null) {

				let data = JSON.parse(buffer);
				if (data instanceof Object) {

					for (let genre in data) {

						if (data[genre] instanceof Object) {

							if (_META[genre] === undefined) {
								_META[genre] = {};
							}

							for (let file in data[genre]) {
								_META[genre][file] = data[genre][file];
							}

						}

					}

				}

			}

		}

	} catch (err) {
	}


	fs.readdir(_ROOT, function(err, albums) {

		if (err) return;

		albums.filter(function(val) {
			return fs.statSync(_ROOT + '/' + val).isDirectory();
		}).forEach(function(album) {

			if (_META[album] === undefined) {
				_META[album] = {};
			}

			fs.readdir(_ROOT + '/' + album, function(err, files) {

				if (err) return;


				files = files.filter(function(val) {
					return fs.statSync(_ROOT + '/' + album + '/' + val).isFile();
				}).filter(function(val) {
					return val.split('.').pop() === 'mp3';
				});

				let all = files.length;

				files = files.filter(function(file) {
					return _META[album][file] === undefined;
				});

				console.log('"' + album + '" -> ' + files.length + '/' + all);

				files.forEach(function(file) {
					_META[album][file] = Date.now();
				});

				files.forEach(function(file) {

					_TODO.push({
						path: _ROOT + '/' + album + '/' + file,
						data: _autoparse_data(album, file)
					});

				});

			});

		});

	});


	setTimeout(function() {

		if (Object.keys(_META).length > 0) {

			try {

				let blob = JSON.stringify(_META, null, '\t');
				if (blob !== null) {
					fs.writeFileSync(_ROOT + '/.auto-tagger.json', blob, 'utf8');
				}

			} catch (err) {
			}

		}

		if (_TODO.length > 0) {

			_TODO.forEach(function(task) {
				_autotag_file(task.path, task.data);
			});

		}

	}, 1000);

}

