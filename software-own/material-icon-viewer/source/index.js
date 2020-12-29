
(function(global) {

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

					button.setAttribute('title',        label + ' / ' + code);
					button.setAttribute('data-label',   label);
					button.setAttribute('data-code',    code);
					button.setAttribute('data-visible', false);

					icon.innerHTML = '&#x' + code + ';';

					button.appendChild(icon);
					main.appendChild(button);

				});

			}

		});

	}

	let button = global.document.querySelector('header > button');
	if (button !== null) {

		button.onclick = () => {

			if (button.className === 'active') {
				main.setAttribute('data-visible', '');
				button.className = '';
				button.innerHTML = '<i>&#xe8f5;</i>';
			} else {
				main.setAttribute('data-visible', 'show');
				button.className = 'active';
				button.innerHTML = '<i>&#xe8f4;</i>';
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

})(typeof window !== 'undefined' ? window : this);

