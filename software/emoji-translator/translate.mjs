
import fs    from 'fs';
import https from 'https';


let buffer = fs.readFileSync('github.txt');


const GITHUB = {
	'a':  'a_button',
	'b': 'b_button',
	'ab': 'ab_button',
	'cl': 'cl_button',
	'o':  'red_circle',
	'o2': 'o_button',
	'ok': 'ok_button',
	'+1': 'thumbs_up',
	'-1': 'thumbs_down',
	'cd': 'optical_disc',
	'm':  'metro',
	'v': 'victory_hand',
	'vs': 'vs_button',
	'wc': 'water_closet',
	'x':  'cross_mark',
};

const SHORT_CODES = [];
const EMOJIS      = [];
const ERRORS      = [];

buffer.toString('utf8').trim().split('\n').forEach((line) => {

	if (line.includes('|') === true) {

		let chunks = line.split('|').map((c) => c.trim()).filter((c) => c.length > 0);

		if (chunks.length > 0) {

			chunks.forEach((chunk) => {

				let name = chunk.split(' ').shift().trim();
				if (name.startsWith(':') && name.endsWith(':')) {
					name = name.substr(1, name.length - 2);

					let check = GITHUB[name] || null;
					if (check !== null) {
						name = check;
					}

					if (SHORT_CODES.includes(name) === false) {
						SHORT_CODES.push(name);
					}

				}

			});

		}

	}

});


const find_emoji = function(html) {

	let found = null;

	let lines = html.split('\n').map((v) => v.trim());

	for (let l = 0, ll = lines.length; l < ll; l++) {

		let line = lines[l];
		if (line.includes('<span class="emoji">') && line.includes('</span')) {
			found = line.split('<span class="emoji">').pop().split('</span>').shift().trim();
			break;
		}

	}

	return found;

};

const translate = function(code, callback) {

	let query  = code.split('_').join(' ');
	let handle = https.request('https://emojipedia.org/search/?q=' + query, (response) => {

		let chunks = [];

		response.on('data', (chunk) => chunks.push(chunk));
		response.on('end', () => {

			let html = Buffer.concat(chunks).toString('utf8');

			if (html.includes('<ol class="search-results">')) {
				html = html.split('<ol class="search-results">').pop();
				html = html.split('</ol>').shift();
			}

			let emoji = find_emoji(html);
			if (emoji !== null) {
				EMOJIS.push({
					'code':  code,
					'emoji': emoji
				});
			} else {
				ERRORS.push({
					'code':  code,
					'emoji': null
				});
			}


			callback(emoji);

		});

	});

	handle.on('error', (err) => {
		console.log(err);
		callback(null);
	});

	handle.end();

};

const save = function() {
	fs.writeFileSync('./emoji.json',  Buffer.from(JSON.stringify(EMOJIS, null, '\t'), 'utf8'));
	fs.writeFileSync('./errors.json', Buffer.from(JSON.stringify(ERRORS, null, '\t'), 'utf8'));
};


setTimeout(() => {

	SHORT_CODES.forEach((code) => {

		translate(code, (emoji) => {

			if (emoji === null) {
				console.log('Can\'t translate "' + code + '"');
			}

			save();

		});

	});

}, 500);

