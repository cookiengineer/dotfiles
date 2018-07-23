#!/usr/bin/env node


const _fs    = require('fs');
const _https = require('https');
const _path  = require('path');
const _USER  = process.argv[2] || null;


if (_USER !== null) {

	let request = _https.request({
		method:   'GET',
		headers:  {
			'User-Agent': 'github.com/cookiengineer/dotfiles'
		},
		protocol: 'https:',
		host:     'api.github.com',
		path:     '/users/' + _USER + '/repos'
	}, response => {

		let buffer = '';

		response.setEncoding('utf8');
		response.on('data', chunk => buffer += chunk);

		response.on('end', _ => {

			let data = null;
			try {
				data = JSON.parse(buffer);
			} catch (err) {
			}


			if (data !== null && data instanceof Array) {

				let filtered = data.map(raw => raw['private'] === true ? raw.ssh_url : raw.clone_url).sort();
				let buffer   = filtered.join('\n');
				let path     = _path.resolve(__dirname, '../' + _USER + '/repos.txt');


				_fs.writeFile(path, buffer, {
					encoding: 'utf8'
				}, err => {
					process.exit((err) ? 1 : 0);
				});

			}

		});

	});

	request.on('error',   err => null);
	request.on('timeout', err => null);

	request.setTimeout(10000);
	request.write('');
	request.end();

}

