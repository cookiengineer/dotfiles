#!/usr/bin/env node

const fs    = require('fs');
const exec  = require('child_process').exec;
const _ROOT = '/home/' + process.env.USER + '/Music';


let user = (process.env.USER || '');
if (user.trim() === '') {

	console.error('No $USER environment variable set.');
	process.exit(1);

} else {

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
					console.log(path + ': FAILURE');
				}

			});

		});

	};


	fs.readdir(_ROOT, function(err, albums) {

		if (err) return;

		albums.filter(function(val) {
			return fs.statSync(_ROOT + '/' + val).isDirectory();
		}).forEach(function(album) {

			fs.readdir(_ROOT + '/' + album, function(err, files) {

				if (err) return;


				files = files.filter(function(val) {
					return fs.statSync(_ROOT + '/' + album + '/' + val).isFile();
				}).filter(function(val) {
					return val.split('.').pop() === 'mp3';
				});


				console.log('Album "' + album + '" has ' + files.length + ' files');

				files.forEach(function(file) {

					let path = _ROOT + '/' + album + '/' + file;
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


						let data = {};

						// XXX: We use Genre as Album here
						if (album  != null) data.genre  = album;

						if (album  != null) data.album  = album;
						if (track  != null) data.track  = track;
						if (artist != null) data.artist = artist;
						if (title  != null) data.title  = title;

						_autotag_file(path, data);

					}

				});

			});


		});

	});


}

