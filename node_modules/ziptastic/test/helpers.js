require('mocha-as-promised')();

var chai           = require('chai'),
    sinonChai      = require('sinon-chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(sinonChai);