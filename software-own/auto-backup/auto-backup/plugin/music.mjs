
import { console                   } from '../console.mjs';
import { copy, exists, mkdir, scan } from '../helper/fs.mjs';
import { BACKUP, MUSIC             } from '../helper/sh.mjs';



const PLUGIN = {

	name: 'music',

	init: {

		collect: (database, callback) => {

			callback(false);

		},

		execute: (database, callback) => {

			callback(false);

		}

	},

	backup: {

		collect: (database, callback) => {

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
							database.push(entry);
						}

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
				database.forEach((genre) => {
					console.info(PLUGIN.name + ': ' + genre.name + ' (' + genre.data.length + ')');
				});
			}

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				database.forEach((genre) => {

					console.log(PLUGIN.name + ': archiving ' + genre.name + ' ...');

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

		}

	},

	restore: {

		collect: (database, callback) => {

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
							database.push(entry);
						}

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
				database.forEach((genre) => {
					console.info(PLUGIN.name + ': ' + genre.name + ' (' + genre.data.length + ')');
				});
			}

		},

		execute: (database, callback) => {

			if (database.length > 0) {

				database.forEach((genre) => {

					console.log(PLUGIN.name + ': restoring ' + genre.name + ' ...');

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

	}

};


export default PLUGIN;

