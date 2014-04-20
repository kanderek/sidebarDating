'use strict';

var ziptastic = require('../'),
    expect    = require('chai').expect;

describe('Ziptastic — Integration Tests', function() {

	it('fetches a ZIP code', function() {
		return expect(ziptastic(10009))
			.to.eventually.deep.equal({
				city: 'New York City',
				state: 'New York',
				country: 'US'
			});
	});

	it('handles server errors', function() {
		return expect(ziptastic(100))
			.to.eventually.be.rejectedWith(/Request/);
	});

});