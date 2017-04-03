'use strict';


var Marketcloud = require('../index');
var Fixtures = require('./fixtures.js');

var expect = require('chai').expect;


describe('Marketcloud module',function(){


	it('Should create an instance of the client',function(){

			var client = Fixtures.getNewClientInstance();
			
			expect(client).to.not.be.an('undefined');
	});


	it('Should be able to re-authenticate and make a call when the token expires',function(){
		// This test covers automatic re-authentication. For this reason we are increasing the default timeout time
		this.timeout(5000);
		var client = Fixtures.getNewClientInstance();

		return client.products.list()
		.then(function(response){
			client.token = "c";
			return client.products.list();
		})
		.then(function(response){
			expect(response.status).to.equal(true);
		})
		.catch(function(response){
			expect(false).to.be(true);
		})


	})

})