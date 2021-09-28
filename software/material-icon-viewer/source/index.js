
(function(global) {

	const canvas   = global.document.createElement('canvas');
	const context  = canvas.getContext('2d');
	const iconfont = new FontFace('icon', 'url("design/icon.woff")');



	const render_image = (codes, color, callback) => {

		let size = Math.ceil(Math.sqrt(codes.length));
		let x    = 1;
		let y    = 1;

		canvas.width        = size * 64;
		canvas.height       = size * 64;
		canvas.style.width  = (size * 64) + 'px';
		canvas.style.height = (size * 64) + 'px';
		canvas.style.fontFamily  = 'icon';
		canvas.style.fontSize    = '48px';
		canvas.style.lineHeight  = '64px';

		context.font         = '48px icon';
		context.textAlign    = 'center';
		context.textBaseline = 'middle';
		context.fillStyle    = color;

		context.clearRect(0, 0, size * 64, size * 64);

		codes.forEach((code) => {

			context.fillText(
				String.fromCharCode(code),
				x * 64 - 32,
				y * 64 - 32
			);

			if (x < size) {
				x++;
			} else if (x === size) {
				x = 1;
				y++;
			}

		});

		callback(canvas.toDataURL('image/png'));

	};

	const render_text = (classes, callback) => {

		let text = `
			@font-face {
				font-family: 'icon';
				src: url('/path/to/icon.woff') format('woff');
				font-variant: normal;
				font-weight: normal;
				font-style: normal;
			}

			[class^="icon-"]:before,
			[class*="icon-"]:before {
				display: inline;
				width: 1em;
				margin-right: 0.25em;
				line-height: 1em;
				font-family: 'icon';
				font-style: normal;
				font-variant: normal;
				font-weight: normal;
				text-align: center;
				text-decoration: inherit;
				text-transform: none;
				speak: none;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
			}
		`.split('\n').map((line) => line.substr(3)).join('\n');

		text += '\n';

		let length = classes.map((entry) => {
			return entry.label.length;
		}).reduce((a, b) => {
			return Math.max(a, b);
		}, 0);

		console.log(length);
		// TODO: indent labels correctly

		classes.forEach((entry) => {
			text += '.icon-' + entry.label + ':before { content: "' + entry.code + '"; }\n';
		});

		callback(text);

	};



	let main = global.document.querySelector('main');
	if (main !== null) {

		global.fetch('./source/codepoints.txt').then((res) => {
			return res.text();
		}).then((res) => {

			let lines = (res || '').trim().split('\n').filter((l) => l.trim() !== '');
			if (lines.length > 0) {

				lines.forEach((line) => {

					let label  = line.split(' ')[0];
					let code   = line.split(' ')[1];
					let button = global.document.createElement('button');
					let icon   = global.document.createElement('i');

					button.setAttribute('title',         label + ' / ' + code);
					button.setAttribute('data-label',    label);
					button.setAttribute('data-code',     code);
					button.setAttribute('data-visible',  false);
					button.setAttribute('data-selected', false);

					icon.innerHTML = '&#x' + code + ';';

					button.onclick = () => {

						if (button.getAttribute('data-selected') === 'true') {
							button.setAttribute('data-selected', false);
						} else {
							button.setAttribute('data-selected', true);
						}

					};

					button.appendChild(icon);
					main.appendChild(button);

				});

			}

		});

	}

	let visibility = global.document.querySelector('header > button[data-type="visibility"]');
	if (visibility !== null) {

		visibility.onclick = function() {

			if (this.className === 'active') {
				main.setAttribute('data-visible', '');
				this.className = '';
				this.innerHTML = '<i>&#xe8f5;</i>';
			} else {
				main.setAttribute('data-visible', 'show');
				this.className = 'active';
				this.innerHTML = '<i>&#xe8f4;</i>';
			}

		};

	}

	let input = global.document.querySelector('header > input[type="search"]');
	if (input !== null) {

		input.onkeyup = () => {

			let value = input.value || '';
			if (value !== '') {

				Array.from(global.document.querySelectorAll('main button')).forEach((button) => {

					let visible = false;

					let label = button.getAttribute('data-label');
					if (label.includes(value)) {
						visible = true;
					}

					let code = button.getAttribute('data-code');
					if (code.includes(value)) {
						visible = true;
					}

					button.setAttribute('data-visible', visible);

				});

			} else {

				Array.from(global.document.querySelectorAll('main button')).forEach((button) => {
					button.setAttribute('data-visible', false);
				});

			}

		};

	}

	let image = global.document.querySelector('header > button[data-type="image"]');
	if (image !== null) {

		iconfont.load().then((font) => {
			global.document.fonts.add(font);
		});

		image.onclick = function() {

			let data = Array.from(main.querySelectorAll('button[data-selected="true"]')).map((button) => {
				return '0x' + button.getAttribute('data-code');
			});

			if (data.length > 0) {

				render_image(data, '#ffffff', (blob) => {

					let download = global.document.createElement('a');

					download.setAttribute('rel',      'download');
					download.setAttribute('download', 'spritemap-dark.png');
					download.setAttribute('href',      canvas.toDataURL('image/png'));

					download.click();

				});

				render_image(data, '#000000', (blob) => {

					let download = global.document.createElement('a');

					download.setAttribute('rel',      'download');
					download.setAttribute('download', 'spritemap-light.png');
					download.setAttribute('href',      canvas.toDataURL('image/png'));

					download.click();

				});

			}

		};

	}

	let text = global.document.querySelector('header > button[data-type="text"]');
	if (text !== null) {

		text.onclick = () => {

			let selectors = Array.from(main.querySelectorAll('button[data-selected="true"]')).map((button) => {
				return {
					label: button.getAttribute('data-label'),
					code:  '\\' + button.getAttribute('data-code')
				};
			});

			render_text(selectors, (text) => {
				console.log(text);
			});

		};

		// TODO: Export to CSS file
	}

})(typeof window !== 'undefined' ? window : this);

