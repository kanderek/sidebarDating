'use strict';

var Promise = require('bluebird'),
    request = Promise.promisify(require('request').get),
    _       = require('lodash');


function Ziptastic(endpoint) {
	this.endpoint = endpoint || 'http://zip.elevenbasetwo.com/v2';
}

Ziptastic.create = function(endpoint) {
	var ziptastic = new Ziptastic(endpoint);
	return ziptastic.parse.bind(ziptastic);
};

Ziptastic.prototype = {
	url: function(options) {
		return [this.endpoint, options.country, options.zip].join('/');
	},
	parse: function(options, callback) {
		return Promise.try(function() {

			if ((_.isString(options) || _.isNumber(options)) && options.toString().match(/^[0-9]+$/)) {
				options = {
					zip: options
				};
			}

			options = _.defaults(options || {}, {
				country: 'US'
			});

			if (!options.zip) {
				throw new Error('A ZIP code must be supplied');
			}

			return request({
				json: true,
				url: this.url(options)
			}).spread(function(response, body) {
				if (response.statusCode >= 400) {
					var err = new Error('Request failed');
					err.response = response;
					throw err;
				} else {
					return body;
				}
			});
		}, null, this).nodeify(callback);
	}
};

var ziptastic = new Ziptastic();

module.exports = _.extend(ziptastic.parse.bind(ziptastic), {
	Ziptastic: Ziptastic,
	create: Ziptastic.create
});