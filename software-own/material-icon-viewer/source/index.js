
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

					button.setAttribute('data-label', label);
					button.setAttribute('data-code',  code);

					icon.innerHTML = '&#x' + code + ';';

					button.appendChild(icon);
					main.appendChild(button);

				});

			}

		});

	}


	let input = global.document.querySelector('input[type="search"]');
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
					button.setAttribute('data-visible', true);
				});

			}

		};

	}

})(typeof window !== 'undefined' ? window : this);

