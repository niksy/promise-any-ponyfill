/* globals AggregateError:false */
/* eslint-disable unicorn/catch-error-name */

function ponyfill(promises) {
	const PromiseContext = this ?? Promise;

	return PromiseContext.all(
		promises.map((promise) => {
			const wrappedPromise =
				(promise?.then ?? null) !== null
					? promise
					: PromiseContext.resolve(promise);
			try {
				return wrappedPromise.then(
					(value) => {
						throw value;
					},
					(error) => error
				);
			} catch (error) {
				return error;
			}
		})
	).then(
		(reasons) => {
			throw new AggregateError(reasons, 'Every promise rejected');
		},
		(value) => value
	);
}

export default ponyfill;

export const preferNative =
	(Promise?.any ?? null) !== null ? Promise.any.bind(Promise) : ponyfill;
