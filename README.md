# promise-any-ponyfill

[![Build Status][ci-img]][ci]
[![BrowserStack Status][browserstack-img]][browserstack]

[`Promise.any`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)
[ponyfill](https://ponyfill.com).

> `Promise.any()` takes an iterable of Promise objects and, as soon as one of
> the promises in the iterable fulfills, returns a single promise that resolves
> with the value from that promise. If no promises in the iterable fulfill (if
> all of the given promises are rejected), then the returned promise is rejected
> with an `AggregateError`, a new subclass of `Error` that groups together
> individual errors. Essentially, this method is the opposite of
> `Promise.all()`.

## Install

```sh
npm install promise-any-ponyfill --save
```

## Usage

```js
import pAny from 'promise-any-ponyfill';

(async () => {
	try {
		const first = await pAny([
			Promise.resolve('becky'),
			Promise.resolve('roxy'),
			Promise.resolve('sadie')
		]);
		// Any of the promises was fulfilled.
		console.log(first);
		// → 'becky'
	} catch (error) {
		// All of the promises were rejected.
		console.log(error);
	}
})();
```

You can **use named export `preferNative` if you wish to use native
implementation if it’s available**. In all other cases, ponyfill will be used.
Beware of
[caveats](https://github.com/sindresorhus/ponyfill#:~:text=Ponyfills%20should,underlying%20environment)!

## API

### any(iterable)

Returns:

-   An **already rejected** `Promise` if the iterable passed is empty.
-   An **asynchronously resolved** `Promise` if the iterable passed contains no
    promises.
-   A **pending** `Promise` in all other cases. This returned promise is then
    resolved/rejected **asynchronously** (as soon as the stack is empty) when
    any of the promises in the given iterable resolve, or if all the promises
    have rejected.

#### iterable

An iterable object, such as an `Array`.

## Browser support

Tested in Chrome 90, Firefox 88, Internet Explorer 11 and should work in all
modern browsers
([support based on Browserslist configuration](https://browserslist.dev/?q=bGFzdCAyIHZlcnNpb25zLCBub3QgaWUgMTAsIGllID49IDEx)).

Assumes `Promise` and `AggregateError` are polyfilled or available in global
context.

## Acknowledgments

-   [Proposed implementation and description on StackOverflow](https://stackoverflow.com/a/37235274/178058)
-   [Proposed implementatio on TC39 feature repository](https://github.com/tc39/proposal-promise-any/issues/6#issue-404950354)

## Related

-   [`AggregateError` ponyfill](https://github.com/niksy/aggregate-error-ponyfill)

## Test

Test suite is taken and modified from
[es-shims](https://github.com/es-shims/Promise.any/blob/master/test/tests.js)
test suite.

For automated tests, run `npm run test:automated` (append `:watch` for watcher
support).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://travis-ci.com/niksy/promise-any-ponyfill
[ci-img]: https://travis-ci.com/niksy/promise-any-ponyfill.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=MEtwckxKSGJ6eDE1UTg5YTRNUEM2Um50K0ZDVjFhUGpnNlE3THFUVHE5TT0tLTdzYkVjV05KZ0tVYUJuTVNHMG55blE9PQ==--3c1c4b767baf981e712844c150fb667befa43547

<!-- prettier-ignore-end -->
