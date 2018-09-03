#!/usr/bin/env node

const fs     = require('fs');
const exec   = require('child_process').exec;
const _ROOT  = '/home/' + process.env.USER + '/Music';
const _META  = {};
const _STAT  = {};
const _TODO  = [];
const _SPACE = ' ' + new Array(128).fill(' ').join(' ');



/*
 * HELPERS
 */

const _format = function(str, length, invert) {

	invert = invert === true;


	if (str.length < length) {

		if (invert === true) {
			return str + _SPACE.substr(0, length - str.length);
		} else {
			return _SPACE.substr(0, length - str.length) + str;
		}

	} else {
		return str;
	}

};

const _autotag_file = function(path, data) {

	let cmd = [ 'id3v2' ];

	// XXX: id3v2 cannot remove and
	// incrementally set in one cmd :-/
	// cmd.push('--delete-all');

	if (data.album  != null) cmd.push('--album "'  + data.album  + '"');
	if (data.genre  != null) cmd.push('--genre "'  + data.genre  + '"');
	if (data.artist != null) cmd.push('--artist "' + data.artist + '"');
	if (data.song   != null) cmd.push('--song "'   + data.song   + '"');

	cmd.push('"' + path + '"');

	// XXX: First delete all tags
	exec('id3v2 --delete-all "' + path + '"', function(err, stdout, stderr) {

		if (err) return;


		// XXX: Then set new tags
		exec(cmd.join(' '), function(err, stdout, stderr) {

			if (err) return;

			if (stdout.trim() !== '' || stderr.trim() !== '') {

				console.log('id3v2 failed tagging "' + path + '".');
				console.log(data);

			}

		});

	});

};

const _autoparse_data = function(album, file) {

	let name = file.substr(0, file.length - 4);

	let artist = name.split(' - ')[0].trim();
	if (artist.includes('(') === true && artist.includes(')') === false) {
		artist = file.substr(0, file.indexOf(')') + 1).trim();
	}

	let song = name.substr(artist.length).trim();
	if (song.startsWith('-')) {
		song = song.substr(1).trim();
	}

	return {
		album:  album,
		artist: artist,
		genre:  album,
		song:   song
	};

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

				_STAT[album] = {
					todo:  0,
					files: files.length
				};

				files = files.filter(function(file) {
					return _META[album][file] === undefined;
				});

				_STAT[album].todo = files.length;

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


		let albums = Object.keys(_STAT).sort();
		let max    = albums.map(v => v.length).reduce((a, b) => Math.max(a, b), 0);
		let header = _SPACE.substr(0, 8) + _format('ALBUM', max, false) + ' - NEW / ALL';
		let div    = new Array(header.length).fill('-').join('');

		console.log(header);
		console.log(div);

		albums.forEach(id => {

			let stat  = _STAT[id];
			let album = _format(id, max, true);
			let todo  = _format('' + stat.todo,  3, false);
			let files = _format('' + stat.files, 3, false);

			console.log('~/Music/' + album + ' - ' + todo + ' / ' + files);

		});

		console.log(div);

		if (_TODO.length > 0) {

			_TODO.forEach(function(task) {
				console.log('> ~/Music/' + task.path.substr(_ROOT.length));
				_autotag_file(task.path, task.data);
			});

		}

	}, 1000);

}

