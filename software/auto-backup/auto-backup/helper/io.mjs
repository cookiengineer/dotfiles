
import { console             } from '../console.mjs';
import { isArray, isFunction } from '../POLYFILLS.mjs';



const process_stack = (stack, results, oncomplete) => {

	let entry = stack.shift() || null;
	if (entry !== null) {

		let args = entry.parameters || [];

		args.push((result) => {
			results.push(result);
			process_stack(stack, results, oncomplete);
		});

		try {

			entry.callback.apply(null, args);

		} catch (err) {

			console.error(err);

			results.push(null);
			process_stack(stack, results, oncomplete);

		}

	} else {

		if (typeof oncomplete === 'function') {
			oncomplete(results);
		}

	}

};

export const queue = (callbacks, parameters, oncomplete) => {

	callbacks  = isArray(callbacks)     ? callbacks.filter((c) => isFunction(c)) : [];
	parameters = isArray(parameters)    ? parameters                             : [];
	oncomplete = isFunction(oncomplete) ? oncomplete                             : () => {};


	let stack = [];

	if (callbacks.length === 1) {

		if (parameters.length > 1) {

			parameters.forEach((data) => {

				stack.push({
					callback:   callbacks[0],
					parameters: [ data ]
				});

			});

		} else if (parameters.length === 1) {

			stack.push({
				callback:   callbacks[0],
				parameters: [ parameters[0] ]
			});

		}

	} else if (callbacks.length > 1) {

		if (parameters.length === callbacks.length) {

			callbacks.forEach((callback, c) => {

				stack.push({
					callback:   callback,
					parameters: [ parameters[c] ]
				});

			});

		} else if (parameters.length > 1) {

			if (callbacks.length > parameters.length) {

				callbacks.forEach((callback, c) => {

					stack.push({
						callback:   callback,
						parameters: [ parameters[c % parameters.length] ]
					});

				});

			} else if (parameters.length > callbacks.length) {

				parameters.forEach((data, d) => {

					stack.push({
						callback:   callbacks[d % callbacks.length],
						parameters: [ data ]
					});

				});

			}

		} else if (parameters.length === 1) {

			callbacks.forEach((callback) => {

				stack.push({
					callback:   callback,
					parameters: [ parameters[0] ]
				});

			});

		}

	}


	if (stack.length > 0) {
		process_stack(stack, [], oncomplete);
	} else {
		oncomplete([]);
	}

};



export default {

	queue: queue

};

