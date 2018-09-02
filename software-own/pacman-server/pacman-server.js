#!/usr/bin/env node

const _exec        = require('child_process').exec;
const _fs          = require('fs');
const _http        = require('http');
const _DB_ROOT     = '/var/lib/pacman/sync';
const _DB_FILES    = [];
const _ENABLE_SIGN = false;
const _PKG_ROOT    = '/var/cache/pacman/pkg';
const _PACMAN_MAP  = {};
const _PORT        = (function(port) {

	if (typeof port === 'string') {

		let tmp = parseInt(port, 10);
		if (!isNaN(tmp)) {
			return tmp;
		}

	}

	return 15678;

})(process.env.PORT);


(function(db) {

	_fs.readdir(db, (err, files) => {

		if (!err) {
			files.forEach(file => _DB_FILES.push(file));
		}

		_DB_FILES.filter(file => file.endsWith('.db')).forEach(file => {

			if (_DB_FILES.includes(file + '.sig') === false) {

				if (_ENABLE_SIGN === true) {

					_exec('/usr/bin/gpg --detach-sign --use-agent --no-armor "' + _DB_ROOT + '/' + file + '"', (err, stdout, stderr) => {

						if (err || ('' + stderr).trim().includes('error')) {
							console.log('Could not sign "' + _DB_ROOT + '/' + file + '.');
						} else {
							_DB_FILES.push(file + '.sig');
						}

					});

				}

			}

		});

	});

})(_DB_ROOT);


const _pacman_download = function(path) {

	console.log(path + ' is being downloaded with pacman ...');

	let name = path.split('/').pop();
	if (name.endsWith('.pkg.tar.xz')) {
		name = name.substr(0, name.length - 11);
	}

	let tmp = name.split('-');
	name = tmp.slice(0, tmp.length - 3).join('-');

	_exec('/usr/bin/pacman -S --downloadonly --noconfirm "' + name + '"', {
		cwd: _PKG_ROOT,
		uid: 0,
		gid: 0
	}, (err, stdout, stderr) => {

		if (err) {

			_serve_error.call(this, 500);

		} else {

			let check = ('' + stderr).trim();
			if (check.includes('error')) {
				_serve_error.call(this, 500);
			} else {
				_serve_file.call(this, path);
			}

		}

	});

};

const _send = function(data) {

	this.writeHead(200, {
		'Content-Type':   'application/octet-stream',
		'Content-Length': Buffer.byteLength(data)
	});

	this.write(data);
	this.end();

};

const _serve_file = function(path) {

	_fs.readFile(path, (err, data) => {

		if (err) {

			if (_PACMAN_MAP[path] === undefined) {
				_PACMAN_MAP[path] = 1;
				_pacman_download.call(this, path);
			} else {
				console.log(path + ' not found.');
				_serve_error.call(this, 404);
			}

		} else {
			_send.call(this, data);
		}

	});

};

const _serve_error = function(code) {
	this.writeHead(code, {});
	this.end();
};



const server = _http.createServer((req, res) => {

	let file = req.url.split('/').pop();

	if ((file.endsWith('.db') || file.endsWith('.db.sig')) && _DB_FILES.includes(file)) {
		_serve_file.call(res, _DB_ROOT + '/' + file);
	} else if (file.endsWith('.tar.xz')) {
		_serve_file.call(res, _PKG_ROOT + '/' + file);
	} else {
		console.log(req.url + ' not found.');
		_serve_error.call(res, 404);
	}

});

try {
	server.listen(_PORT);
	console.log('pacman server running on port ' + _PORT + '.');
} catch (err) {
}

