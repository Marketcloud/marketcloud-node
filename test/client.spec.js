'use strict';


var Marketcloud = require('../index');
var Fixtures = require('./fixtures.js');

var expect = require('chai').expect;


describe('Marketcloud module',function(){


	it('Should create an instance of the client',function(){

			var client = Fixtures.getNewClientInstance();
			
			expect(client).to.not.be.an('undefined');
	})

})