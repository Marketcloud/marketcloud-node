'use strict';



var Fixtures = require('./fixtures.js');

var expect = require('chai').expect;

/*
 *	Not testing every CRUD request, since we built the SDK with inheritance
 *	and basically every endpoint of the SDK is extending resource.
 */
describe('Base Resource testing', function() {

	var client = Fixtures.getNewClientInstance();

	// We are going to test the base resource.
	Fixtures.decorateWithResourceEndpoint(client);

	it('Should get a list of resources', function() {
		return client.resources.list()
			.then(function(response) {
				expect(client.LAST_REQUEST).to.deep.equal({
					method: 'GET',
					endpoint: '/resources',
					query: {},
					options: {}
				})
			})

	})

	it('Should get a resource by id', function() {

		return client.resources.getById(1)
			.then(function(response) {
				expect(client.LAST_REQUEST).to.deep.equal({
					method: 'GET',
					endpoint: '/resources/1',
					query: {},
					options: {}
				})
			})

	})

	it('Should create a resource', function() {
		var resource = {
			foo: "bar"
		}
		return client.resources.create(resource)
			.then(function(response) {
				expect(client.LAST_REQUEST).to.deep.equal({
					method: 'POST',
					endpoint: '/resources',
					data: resource,
					options: {}
				})
			})

	})

	it('Should update a resource', function() {
		var resourceUpdate = {
			foo: "baz"
		}
		return client.resources.update(1, resourceUpdate)
			.then(function(response) {
				expect(client.LAST_REQUEST).to.deep.equal({
					method: 'PUT',
					endpoint: '/resources/1',
					data: resourceUpdate,
					options: {}
				})
			})

	})


	it('Should delete a resource', function() {
		return client.resources.delete(1)
			.then(function(response) {
				expect(client.LAST_REQUEST).to.deep.equal({
					method: 'DELETE',
					endpoint: '/resources/1',
					options: {}
				})
			})

	})

})