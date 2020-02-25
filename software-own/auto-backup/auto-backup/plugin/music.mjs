
import { console                   } from '../console.mjs';
import { copy, exists, mkdir, scan } from '../helper/fs.mjs';
import { exec, BACKUP, HOST, MUSIC } from '../helper/sh.mjs';



const _collect = (mode, database, callback) => {

	database['music'] = [];


	if (mode === 'backup') {

		if (exists(MUSIC)) {

			let genres = scan(MUSIC, false).filter((genre) => {

				if (
					exists(MUSIC + '/' + genre, 'folder')
					&& genre.startsWith('__') === false
				) {
					return true;
				}

				return false;

			});

			if (genres.length > 0) {

				genres.forEach((genre) => {

					let entry = {
						name: genre,
						data: []
					};

					scan(MUSIC + '/' + genre, false).forEach((file) => {

						let tmp = file.split('.').slice(0, -1).join('.');
						if (tmp.includes(' - ') && tmp.split(' - ').length === 2) {

							let artist = tmp.split(' - ')[0];
							let title  = tmp.split(' - ')[1];

							if (exists(BACKUP + '/Music/' + genre + '/' + file) === false) {

								entry.data.push({
									artist:  artist,
									backup:  BACKUP + '/Music/' + genre + '/' + file,
									genre:   genre,
									name:    artist + ' - ' + title,
									origin:  MUSIC + '/' + genre + '/' + file,
									title:   title
								});

							}

						}

					});

					if (entry.data.length > 0) {
						database['music'].push(entry);
					}

				});

				callback(true);

			} else {

				callback(false);

			}

		} else {

			callback(false);

		}

	} else if (mode === 'restore') {

		if (exists(BACKUP + '/Music')) {

			let genres = scan(BACKUP + '/Music', false).filter((genre) => {

				if (
					exists(BACKUP + '/Music/' + genre, 'folder')
					&& genre.startsWith('__') === false
				) {
					return true;
				}

				return false;

			});

			if (genres.length > 0) {

				genres.forEach((genre) => {

					let entry = {
						name: genre,
						data: []
					};

					scan(BACKUP + '/Music/' + genre, false).forEach((file) => {

						let tmp = file.split('.').slice(0, -1).join('.');
						if (tmp.includes(' - ') && tmp.split(' - ').length === 2) {

							let artist = tmp.split(' - ')[0];
							let title  = tmp.split(' - ')[1];

							if (exists(MUSIC + '/' + genre + '/' + file) === false) {

								entry.data.push({
									artist:  artist,
									backup:  BACKUP + '/Music/' + genre + '/' + file,
									genre:   genre,
									name:    artist + ' - ' + title,
									origin:  MUSIC + '/' + genre + '/' + file,
									title:   title
								});

							}

						}

					});

					if (entry.data.length > 0) {
						database['music'].push(entry);
					}

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

	database['music'] = database['music'] || [];


	if (mode === 'backup') {

		if (database['music'].length > 0) {
			database['music'].forEach((genre) => {
				console.info('music: ' + genre.name + ' (' + genre.data.length + ')');
			});
		}

	} else if (mode === 'restore') {

		if (database['music'].length > 0) {
			database['music'].forEach((genre) => {
				console.info('music: ' + genre.name + ' (' + genre.data.length + ')');
			});
		}

	}

};

const _execute = (mode, database, callback) => {

	database['music'] = database['music'] || [];


	if (mode === 'backup') {

		if (database['music'].length > 0) {

			database['music'].forEach((genre) => {

				console.log('music: archiving ' + genre.name + ' ...');

				genre.data.forEach((entry) => {

					let folder = entry.backup.split('/').slice(0, -1).join('/');
					if (exists(folder, 'folder') === false) {
						mkdir(folder);
					}

					if (exists(entry.backup) === false) {
						copy(entry.origin, entry.backup);
					}

				});

			});

			callback(true);

		} else {

			callback(false);

		}

	} else if (mode === 'restore') {

		if (database['music'].length > 0) {

			database['music'].forEach((genre) => {

				console.log('music: restoring ' + genre.name + ' ...');

				genre.data.forEach((entry) => {

					let folder = entry.origin.split('/').slice(0, -1).join('/');
					if (exists(folder, 'folder') === false) {
						mkdir(folder);
					}

					if (exists(entry.origin) === false) {
						copy(entry.backup, entry.origin);
					}

				});

			});

			callback(true);

		} else {

			callback(false);

		}

	}

};



export default {

	name:    'music',

	collect: _collect,
	details: _details,
	execute: _execute

};

