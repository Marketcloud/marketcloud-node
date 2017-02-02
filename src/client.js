module.exports = (function() {

	"use strict";

	var	Promise = require('bluebird'),
		crypto 	= require('crypto'),
		request = require('superagent'),
		path 	= require('path'),
		endpoints = require(path.join(__dirname,'endpoints.js'));

	/*
	 *
	 *	[Client The client's instance]
	 *
	 *	@param {string} config.public_key The application's public key
	 *	@param {string} config.secret_key The application's secret key
	 *	
	 * 
	 */
	function Client(config) {

		this.token = null;
		this.public_key = config.public_key;
		this.secret_key = config.secret_key;

		this.baseUrl = 'https://api.marketcloud.it';

		// Marketcloud's api is versioned by URL
		// for instance, the current api is api.marketcloud.it/v0/<endpoint>
		this.apiVersion = 'v0';

		// If this is true, then api responses with status code >= 400
		//  are rejected as errors.
		//  If set to false all responses from server are resolved
		//  
		//  In both cases, "failures" are rejected.
		this.rejectApiErrors = config.rejectApiErrors || true;

		// Creating resources instances
		for (var endpoint_name in endpoints) {

			var e = new endpoints[endpoint_name](this);
			this[e.name] = e;
		}

		this.RETRIES = 0;
		this.MAX_RETRIES = 2;

	}

	/*
	 *
	 * 	@returns {string} The base url for api calls
	 * 	e.g. https://api.marketcloud.it/v0
	 */
	Client.prototype.getApiBaseUrl = function() {
			return this.baseUrl + '/' + this.apiVersion;
		}
		/*
		 *
		 * 	[requestFactory: Performs an HTTP request based on the configuration parameter]
		 *
		 *	@param {string} config.method The HTTP method 'PUT','POST','GET','PATCH' etc
		 *	@param {object} config.data POST data to append to the request
		 *	@param {object} config.query Query string object
		 */
	Client.prototype.requestFactory = function(config) {
		var _this = this;


		if (this.token === null) {

			return this.authenticate()
				.then(function() {

					return _this.requestFactory(config);
				});
		}

		return new Promise(function(resolve, reject) {
			var req = request(config.method, _this.getApiBaseUrl() + config.endpoint);

			req.set('Authorization', _this.getAuthorizationHeader());

			if (config.query)
				req.query(config.query || {});

			if (config.data)
				req.send(config.data || {});


			req.end(function(err, response) {


				if (err) {



					if (err.response) {

						if (401 === err.response.statusCode) {
							// The token expired
							// need to refresh it
							console.log("Token expired, must re-authenticate")
							return _this.authenticate()
								.then(function() {
									console.log("Re-authenticated after token expiration")
									return _this.requestFactory(config);
								});
						}
						// Packaging the error response in an error
						// TODO create ad-hoc errors
						// This is most likely a response with status >= 400
						if (_this.rejectApiErrors) {
							// If the  option is true
							// then responses with status >= 400 are rejected as errors
							var _err = new Error();
							for (var k in err.response.body.errors[0])
								_err[k] = err.response.body.errors[0][k];
							reject(_err);
						} else {
							// If the simple option is false
							// then responses with code >= 400 are resolved

							resolve(err.response.body.errors[0]);

						}

					} else
						reject(err);

				} else
					resolve(response.body);



			})
		});



	}

	// Utility HTTP request
	Client.prototype._Get = function(endpoint, query) {
			return this.requestFactory({
				method: 'GET',
				endpoint: endpoint,
				query: query || {}
			})
		}
		// Utility HTTP request
	Client.prototype._Post = function(endpoint, data) {
		return this.requestFactory({
			method: 'POST',
			endpoint: endpoint,
			data: data || {}
		})
	}

	// Utility HTTP request
	Client.prototype._Put = function(endpoint, data) {
		return this.requestFactory({
			method: 'PUT',
			endpoint: endpoint,
			data: data || {}
		});
	}


	// Utility HTTP Patch request
	Client.prototype._Patch = function(endpoint, data) {
		return this.requestFactory({
			method: 'PATCH',
			endpoint: endpoint,
			data: data || {}
		})
	}

	// Utility HTTP Delete request
	Client.prototype._Delete = function(endpoint) {
		return this.requestFactory({
			method: 'DELETE',
			endpoint: endpoint
		})
	}


	// Utility, returns a formatted HTTP header
	Client.prototype.getAuthorizationHeader = function() {
		if (this.token)
			return this.public_key + ':' + this.token
		else
			return this.public_key
	}

	// Generates an auth Token from the credentials stored inside the client.
	Client.prototype.authenticate = function() {

		var now = Date.now();
		var h = "" + this.secret_key + now;
		var hash = crypto.createHash('sha256')
			.update(h)
			.digest('base64');

		var _this = this;
		var payload = {
			publicKey: _this.public_key,
			secretKey: hash,
			timestamp: now
		}
		return new Promise(function(resolve, reject) {
			request
				.post(_this.getApiBaseUrl() + '/tokens')
				.set('Authorization', _this.getAuthorizationHeader())
				.send(payload)
				.end(function(err, response) {

					if (err) {
						if (err.response) {
							// Packaging the error response in an error
							// TODO create ad-hoc errors
							var _err = new Error();
							for (var k in err.response.body.errors[0])
								_err[k] = err.response.body.errors[0][k];
							reject(_err);
						} else
							reject(err);

					} else {
						_this.token = response.body.token;
						resolve(response.body.data);
					}

				})
		})



	}

	return Client;
})()