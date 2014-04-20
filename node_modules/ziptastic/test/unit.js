'use strict';

var ziptastic = require('../'),
    expect    = require('chai').expect,
    sinon     = require('sinon'),
    nock      = require('nock');

describe('Ziptastic — Unit Tests', function() {

	beforeEach(function() {
		this.ziptastic = new ziptastic.Ziptastic();
	});

	it('exports the parse function of an instance', function() {
		expect(ziptastic)
			.to.be.a('function');
	});

	it('it attaches the constructor to the export', function() {
		expect(ziptastic.Ziptastic)
			.to.be.a('function');
	});

	it('defaults to the public endpoint', function() {
		expect(this.ziptastic.endpoint)
			.to.equal('http://zip.elevenbasetwo.com/v2');
	});

	it('can be constructed with a custom endpoint', function() {
		var endpoint = 'ep';
		expect(new ziptastic.Ziptastic(endpoint).endpoint)
			.to.equal(endpoint);
	});

	it('can create instances and return the parse function', function() {
		expect(ziptastic.create('ep'))
			.to.be.a('function');
	});

	describe('#url', function() {
		it('joins the URL components with a "/"', function() {
			this.ziptastic.endpoint = 'E';
			expect(this.ziptastic.url({
				country: 'C',
				zip: 'Z'
			})).to.equal('E/C/Z');
		});
	});

	describe('#parse', function() {

		beforeEach(function() {
			this.response = {p: 'v'};

			nock(this.ziptastic.endpoint)
				.persist()
				.filteringPath(function() {
					return '*';
				})
				.get('*')
				.reply(200, JSON.stringify(this.response));

			this.error = 'http://error.local';

			nock(this.error)
				.persist()
				.filteringPath(function() {
					return '*';
				})
				.get('*')
				.reply(400, '{"p": "v"}');

		});

		beforeEach(function() {
			this.url = sinon.spy(this.ziptastic, 'url');
			this.callback = sinon.spy();
			this.parse = this.ziptastic.parse(10000, this.callback);
			return this.parse;
		});

		afterEach(function() {
			nock.cleanAll();
		});

		it('requires a ZIP code', function() {
			return expect(ziptastic())
				.to.eventually.be.rejectedWith(/ZIP/);
		});

		it('can accept a number directly', function() {
			return ziptastic(10000);
		});

		it('can accept a numeric string directly', function() {
			return ziptastic('10000');
		});

		it('defaults to the US', function() {
			sinon.assert.calledWithMatch(this.url, {country: 'US'});
		});

		it('resolves the parsed response body', function() {
			return expect(this.ziptastic.parse(10000))
				.to.eventually.eql(this.response);
		});

		it('casts 400+ responses into errors', function() {
			this.ziptastic = new ziptastic.Ziptastic(this.error);
			expect(this.ziptastic.parse(10000))
				.to.eventually.be.rejected
				.then(function(err) {
					return expect(err)
						.to.have.property('response');
				});
		});

		it('calls the node-style callback', function() {
			sinon.assert.calledWith(this.callback, null, this.response);
		});

	});
});