# Ziptastic [![Build Status](https://travis-ci.org/bendrucker/node-ziptastic.png?branch=master)](https://travis-ci.org/bendrucker/node-ziptastic) [![NPM version](https://badge.fury.io/js/ziptastic.png)](http://badge.fury.io/js/ziptastic)

Use the [Ziptastic](http://daspecster.github.io/ziptastic/) API to retrieve city and state information from a zip code.

## Getting Started

Install from [npm](https://npmjs.org/package/ziptastic):

```shell
npm install ziptastic
```

## Executing Queries

##### `ziptastic(options, [callback])` -> `promise`

The library exposes the ZIP parser function directly. It returns a promise, but will also call a node-style callback if one is passed in.

```javascript
var ziptastic = require('ziptastic');
var query = {
	zip: '10000',
	country: 'US'
};
```

Using promises:

```javascript
ziptastic(query).then(function(location) {
	// location => {city: "New York City", state: "New York", country: "US"}
});
```

Using callbacks: 

```javascript
ziptastic(query, function(err, location) {
	// location => {city: "New York City", state: "New York", country: "US"}
});
```

The function expects an object with properties `zip` and `country`. If no country is provided, it defaults to `US`. If the `options` argument is a number or numeric string, the library will assume it is a zip code in the US. All of the following are equivalent to the original query: 

```javascript
ziptastic(10000);
ziptastic('10000');
ziptastic({zip: '10000'});
```

## Custom Instances
You can construct custom instances with your own endpoint if you're running the [ziptastic application](https://github.com/daspecster/ziptastic) on your own server. The constructor is stored on the parser function:

```javascript
var ziptastic = ziptastic.create('http://mycustomendpoint.com');
```

`ziptastic.create` returns the `parse` function bound to an instance with your `endpoint`. You can also get full access to the instance using:

```javascript
var ziptastic = new ziptastic.Ziptastic([endpoint]);
```

## Handling Errors

The library will automatically convert HTTP status codes >= 400 into errors. Catch them using promises:

```javascript
ziptastic('100').catch(function(err) {
	err instanceof Error // => true
});
```

Or callbacks:
```javascript
ziptastic('100', function(err, location) {
	err instanceof Error // => true
});
```

The error stores the raw response object from [request](https://github.com/mikeal/request) as `err.response` for easy debugging.

## Tests

```shell
npm test
```

## License

[MIT License](LICENSE.md)