#!/usr/bin/env node

const fs      = require('fs');
const dns     = require('dns');
const DOMAINS = process.argv.slice(2).map((v) => v.trim()).filter((v) => v.includes('.'));
const HOSTS   = fs.readFileSync('/etc/hosts', 'utf8');



/*
 * HELPERS
 */

const lookup = (domain, callback) => {

	dns.lookup(domain, {
		family: 0
	}, (err, address) => {

		if (err !== null) {
			callback(null);
		} else {
			callback(address);
		}

	});

};

const write = (domain, address) => {

	let lines = [];

	let warning = HOSTS.includes('\n# Do NOT edit below (maintained by auto-lookup)');
	if (warning === false) {
		lines.push('# Do NOT edit below (maintained by auto-lookup)');
	}

	let host = HOSTS.includes('\n' + address.trim() + ' ' + domain.trim());
	if (host === false) {
		lines.push(address.trim() + ' ' + domain.trim());
	}

	let output = HOSTS + '\n' + lines.join('\n').trim();
	if (output.length > 0) {

		try {

			fs.writeFileSync('/etc/hosts', output, {
				encoding: 'utf8'
			});

			console.info('Updated /etc/hosts file.');

		} catch (err) {
			console.error('Could not update /etc/hosts file.');
		}

	}

};



/*
 * IMPLEMENTATION
 */

DOMAINS.forEach((domain) => {

	lookup(domain, (address) => {

		if (address !== null) {

			console.log('Found domain "' + domain  + '" with IP "' + address + '".');
			write(domain, address);

		}

	});

});

