/*
*	Utilities for tests
*/

var Marketcloud = require('../index');
var Resource = require('../src/endpoints/resource.js');

var Fixtures = {};

Fixtures.getNewClientInstance = function() {
	var client = new Marketcloud.Client({
				public_key : process.env.MARKETCLOUD_PUBLIC_KEY,
			  secret_key : process.env.MARKETCLOUD_SECRET_KEY
			});

	// For testing, we just check that the request is well formed.
	client.rejectApiErrors = false;

	return client;
}


Fixtures.decorateWithResourceEndpoint = function(client) {
	client.resources = new Resource(client);
	client.resources.name = "resources";
	client.resources.endpoint = "/resources";
}

module.exports = Fixtures;