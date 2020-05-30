#!/usr/bin/env node

const fs       = require('fs');
const { exec } = require('child_process').exec;

const ROOT       = '/home/' + process.env.USER + '/Music';
const META       = {};
const STATISTICS = {};
const ID3_TASKS  = [];
const SPACE      = ' ' + new Array(128).fill(' ').join(' ');



/*
 * HELPERS
 */

const distance = (str_a, str_b) => {

	let len_a = str_a.length;
	let len_b = str_b.length;

	if (len_a === 0) return len_b;
	if (len_b === 0) return len_a;


	let matrix = new Array(len_a + 1);

	for (let m = 0; m < matrix.length; m++) {

		matrix[m]    = new Array(len_b + 1).fill(0);
		matrix[m][0] = m;

	}

	for (let b = 0; b <= len_b; b++) {
		matrix[0][b] = b;
	}


	for (let a = 1; a <= len_a; a++) {

		let chr_a = str_a.charAt(a - 1);

		for (let b = 1; b <= len_b; b++) {

			if (a === b && matrix[a][b] > 4) {
				return len_a;
			}

			let chr_b = str_b.charAt(b - 1);
			let cost  = chr_a === chr_b ? 0 : 1;

			let min  = matrix[a - 1][b] + 1;
			let min2 = matrix[a][b - 1] + 1;
			let min3 = matrix[a - 1][b - 1] + cost;

			if (min2 < min) min = min2;
			if (min3 < min) min = min3;

			matrix[a][b] = min;


			if (a > 1 && b > 1 && chr_a === str_b.charAt(b - 2) && str_a.charAt(a - 2) === chr_b) {
				matrix[a][b] = Math.min(matrix[a - 2][b - 2], matrix[a - 2][b - 2] + cost);
			}

		}

	}


	return matrix[len_a][len_b];

};

const filter = (str) => {

	let tmp = str.split(' ');

	let ch1 = tmp[tmp.length - 1];
	if (ch1.endsWith('.mp3')) {
		tmp[tmp.length - 1] = ch1.substr(0, ch1.length - 4);
	}

	for (let t = 0, tl = tmp.length; t < tl; t++) {

		let chunk = tmp[t].trim().toLowerCase();
		let cl    = chunk.length;

		// map
		if (chunk[0] === '(')           chunk = chunk.substr(1);
		if (chunk[cl - 1] === ')')      chunk = chunk.substr(cl - 1);
		if (chunk.indexOf('.') !== -1)  chunk = chunk.split('.').join('');
		if (chunk.indexOf('\'') !== -1) chunk = chunk.split('\'').join('');
		if (chunk.indexOf('"') !== -1)  chunk = chunk.split('"').join('');
		if (chunk === '&')              chunk = 'and';

		// filter
		if (chunk === '-') chunk = null;
		if (chunk === '')  chunk = null;

		if (chunk !== null) {
			tmp[t] = chunk;
		} else {
			tmp.splice(t, 1);
			tl--;
			t--;
		}

	}

	return tmp.join(' ');

};

const format = (str, length, invert) => {

	invert = invert === true;


	if (str.length < length) {

		if (invert === true) {
			return str + SPACE.substr(0, length - str.length);
		} else {
			return SPACE.substr(0, length - str.length) + str;
		}

	} else {
		return str;
	}

};

const autotag_file = function(path, data) {

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

const autoparse_data = function(album, file) {

	if (file.endsWith('.mp3')) {
		file = file.substr(0, file.length - 4);
	}

	let tmp = file.split(' - ').map((v) => v.trim());
	if (tmp.length === 2) {

		let artist = tmp[0];
		let song   = tmp[1];

		if (artist.includes('(') === true && artist.includes(')') === false) {
			artist = file.substr(0, file.indexOf(')') + 1).trim();
		}

		if (song.includes('-') === false) {


			return {
				album:  album,
				artist: artist,
				genre:  album,
				song:   song
			};

		}

	}


	return null;

};



/*
 * IMPLEMENTATION
 */

let user = (process.env.USER || '');
if (user.trim() === '') {

	console.error('No $USER environment variable set.');
	process.exit(1);

} else {

	let stat = null;
	try {
		stat = fs.lstatSync(ROOT + '/.auto-tagger.json');
	} catch (err) {
	}

	if (stat !== null && stat.isFile()) {

		let buffer = fs.readFileSync(ROOT + '/.auto-tagger.json', 'utf8');
		if (buffer !== null) {

			let data = JSON.parse(buffer);
			if (data instanceof Object) {

				for (let genre in data) {

					if (data[genre] instanceof Object) {

						if (STATISTICS[genre] === undefined) {
							STATISTICS[genre] = {
								'new': 0,
								'old': 0,
								'all': 0
							};
						}

						if (META[genre] === undefined) {
							META[genre] = {};
						}

						for (let file in data[genre]) {

							let check = true;

							try {
								fs.lstatSync(ROOT + '/' + genre + '/' + file);
							} catch (err) {

								if (err.code === 'ENOENT') {
									check = false;
								}

							}


							if (check === true) {
								META[genre][file] = data[genre][file];
							} else {
								STATISTICS[genre]['old']++;
							}

						}

					}

				}

			}

		}

	}


	fs.readdir(ROOT, (err, genres) => {

		if (err) return;

		for (let g = 0; g < genres.length; g++) {

			let genre = genres[g];

			if (
				genre.startsWith('.') === false
				&& genre.startsWith('__') === false
				&& fs.statSync(ROOT + '/' + genre).isDirectory()
			) {

				if (META[genre] === undefined) {
					META[genre] = {};
				}


				fs.readdir(ROOT + '/' + genre, (err, files) => {

					if (err) return;

					let statistics = STATISTICS[genre] || null;
					if (statistics === null) {
						statistics = STATISTICS[genre] = {
							'new': 0,
							'old': 0,
							'all': 0
						};
					}

					statistics['all'] = files.length;

					for (let f = 0, fl = files.length; f < fl; f++) {

						let file = files[f];
						if (file.endsWith('.mp3') && fs.statSync(ROOT + '/' + genre + '/' + file).isFile()) {

							if (META[genre][file] === undefined) {

								let data = autoparse_data(genre, file);
								if (data !== null) {

									ID3_TASKS.push({
										path: ROOT + '/' + genre + '/' + file,
										data: data
									});

									META[genre][file] = Date.now();
									statistics['new']++;

								} else {

									console.log('WARNING: Cannot parse "' + file + '"');

								}

							}

						}

					}

				});

			} else {

				console.log('WARNING: Ignoring "' + genre + '"');

			}

		}

	});


	setTimeout(() => {

		if (Object.keys(META).length > 0) {

			try {

				let blob = JSON.stringify(META, null, '\t');
				if (blob !== null) {
					fs.writeFileSync(ROOT + '/.auto-tagger.json', blob, 'utf8');
				}

			} catch (err) {
			}

		}


		let genres = Object.keys(STATISTICS).sort();
		let max    = Math.max.apply(0, genres.map(str => str.length));
		let header = SPACE.substr(0, 8) + format('ALBUM', max, false) + ' | NEW | OLD | ALL';
		let div    = '+' + new Array(header.length + 2).fill('-').join('') + '+';

		console.log(div);
		console.log('| ' + header + ' |');
		console.log(div);

		for (let g = 0, gl = genres.length; g < gl; g++) {

			let genre = genres[g];
			let stat  = STATISTICS[genre];
			let album = format(genre, max, true);
			let s_new = format('' + stat['new'], 3, false);
			let s_old = format('' + stat['old'], 3, false);
			let s_all = format('' + stat['all'], 3, false);

			console.log('| ~/Music/' + album + ' | ' + s_new + ' | ' + s_old + ' | ' + s_all + ' |');

		};

		console.log(div);


		let references = [];

		for (let genre in META) {

			let files = Object.keys(META[genre]);

			for (let f = 0, fl = files.length; f < fl; f++) {

				let file = files[f];

				references.push({
					genre:    genre,
					file:     file,
					sentence: filter(file)
				});

			}

		}


		let rl           = references.length;
		let sl           = 0;
		let similarities = [];

		for (let r1 = 0; r1 < rl; r1++) {

			let reference1 = references[r1];

			for (let r2 = 0; r2 < rl; r2++) {

				let reference2 = references[r2];
				if (reference1 === reference2) continue;

				let sentence1 = reference1.sentence;
				let sentence2 = reference2.sentence;
				let maxlength = Math.max(sentence1.length, sentence2.length);

				let dist = distance(sentence1, sentence2);
				if (dist < 0.1 * maxlength) {

					let check = null;

					for (let s = 0; s < sl; s++) {

						let other = similarities[s];
						if (other[0] === reference1 && other[1] === reference2) {
							check = other;
							break;
						}

						if (other[0] === reference2 && other[1] === reference1) {
							check = other;
							break;
						}

					}

					if (check === null) {

						similarities.push([
							reference1,
							reference2,
							(1 - dist / maxlength) * 100
						]);

						sl++;

					}

				}

			}

		}


		if (similarities.length > 0) {

			console.log('|      WARNING: Found similar looking songs!     |');
			console.log(div);

			similarities.sort((a, b) => {
				if (a[2] > b[2]) return -1;
				if (b[2] > a[2]) return  1;
				return 0;
			}).forEach(similarity => {

				let sim_a   = similarity[0];
				let sim_b   = similarity[1];
				let percent = similarity[2];

				console.log('|');
				console.log('|> Similarity: ' + (percent).toFixed(2) + '%');
				console.log('|  ~/Music/' + sim_a.genre + '/' + sim_a.file);
				console.log('|  ~/Music/' + sim_b.genre + '/' + sim_b.file);

			});

			console.log('|');

			if (ID3_TASKS.length === 0) {
				console.log(div);
			}

		}


		if (ID3_TASKS.length > 0) {

			console.log(div);
			console.log('|        Auto-Tagging Songs via id3v2 ...        |');
			console.log(div);
			console.log('|');

			for (let t = 0, tl = ID3_TASKS.length; t < tl; t++) {

				let task = ID3_TASKS[t];

				console.log('|> ~/Music' + task.path.substr(ROOT.length));
				autotag_file(task.path, task.data);

			}

			console.log('|');
			console.log(div);

		}

	}, 1000);

}

