/* globals globalThis:false */

import assert from 'assert';
import { preferNative as AggregateError } from 'aggregate-error-ponyfill';
import any, { preferNative } from '../index';

if (!globalThis.AggregateError) {
	globalThis.AggregateError = AggregateError;
}

before(function () {
	window.fixture.load('/test/fixtures/index.html');
});

after(function () {
	window.fixture.cleanup();
});

const Subclass = (function () {
	try {
		// eslint-disable-next-line no-new-func
		return new Function(
			'class Subclass extends Promise { constructor(...args) { super(...args); this.thenArgs = []; } then(...args) { Subclass.thenArgs.push(args); this.thenArgs.push(args); return super.then(...args); } } Subclass.thenArgs = []; return Subclass;'
		)();
	} catch (error) {
		/**/
	}

	return false;
})();

const assertArray = (value, length, assertType) => {
	assert.ok(Array.isArray(value), 'value is an array');
	assert.equal(value.length, length, `length is ${length}`);
	if (typeof assertType === 'function') {
		for (let index = 0; index < value.length; index += 1) {
			assertType(value[index]);
		}
	}
};

const a = {};
const b = {};
const c = {};

it('should handle empty iterable', async function () {
	try {
		await any([]);
	} catch (error) {
		assert.equal(
			error instanceof AggregateError,
			true,
			'is an AggregateError'
		);
		assert.deepEqual(error.errors, []);
	}
});

it('should handle no promise values', async function () {
	const result = await any([a, b, c]);
	assert.deepEqual(result, a);
});

it('should handle all fulfilled', async function () {
	const result = await any([
		Promise.resolve(a),
		Promise.resolve(b),
		Promise.resolve(c)
	]);
	assert.deepEqual(result, a);
});

it('should handle all rejected', async function () {
	try {
		await any([Promise.reject(a), Promise.reject(b), Promise.reject(c)]);
	} catch (error) {
		assert.equal(
			error instanceof AggregateError,
			true,
			'is an AggregateError'
		);
		assert.deepEqual(error.errors, [a, b, c]);
	}
});

it('should handle mixed', async function () {
	const mixed = await any([a, Promise.resolve(b), Promise.reject(c)]);
	assert.deepEqual(mixed, a);

	const onlyPromises = await any([
		Promise.reject(a),
		Promise.resolve(b),
		Promise.reject(c)
	]);
	assert.deepEqual(onlyPromises, b);
});

it('should handle poisoned .then', async function () {
	const poison = new EvalError();
	const promise = new Promise(function () {});
	promise.then = function () {
		throw poison;
	};
	try {
		await any([promise]);
	} catch (error) {
		assert.equal(
			error instanceof AggregateError,
			true,
			'error is an AggregateError'
		);
		assert.deepEqual(
			error.errors,
			[poison],
			'rejection showed up as expected'
		);
	}
});

it('should use native implementation if it’s available', async function () {
	const result = await preferNative([a, b, c]);
	assert.deepEqual(result, a);
});

const isIE = window.navigator.msPointerEnabled;
const conditionalDescribe = isIE ? describe.skip : describe;

conditionalDescribe('Inheritance', function () {
	it('should preserve correct subclass', function () {
		const promise = any.call(Subclass, [1]);
		assert.ok(
			promise instanceof Subclass,
			'promise is instanceof Subclass'
		);
		assert.equal(
			promise.constructor,
			Subclass,
			'promise.constructor is Subclass'
		);
	});

	it('should invoke the subclass’ then', function () {
		Subclass.thenArgs.length = 0;

		const original = Subclass.resolve();
		assertArray(Subclass.thenArgs, 0);
		assertArray(original.thenArgs, 0);

		any.call(Subclass, [original]);

		assertArray(original.thenArgs, 1);
		assertArray(Subclass.thenArgs, 3);
	});
});
