
import { console } from '../console.mjs';
import { isArray, isFunction } from '../POLYFILLS.mjs';



const process_stack = (stack, results, parameters, callback) => {

	let entry = stack.shift() || null;
	if (entry !== null) {

		let args = parameters.slice();

		args.push((result) => {
			results.push(result);
			process_stack(stack, results, parameters, callback);
		});

		try {

			entry.apply(null, args);

		} catch (err) {

			console.error(err);

			results.push(null);
			process_stack(stack, results, parameters, callback);

		}

	} else {

		callback(results);

	}

};

export const queue = (callbacks, parameters, callback) => {

	callbacks  = isArray(callbacks)   ? callbacks.filter((c) => isFunction(c)) : [];
	parameters = isArray(parameters)  ? parameters                             : [];
	callback   = isFunction(callback) ? callback                               : null;


	let stack = callbacks.slice();
	if (stack.length > 0) {
		process_stack(stack, [], parameters, callback);
	} else {
		callback([]);
	}

};



export default {

	queue: queue

};

