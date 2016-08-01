/*
 *	Marketcloud NodeJS SDK
 *   	http://www.marketcloud.it
 *
 *	Copyright (c) 2016 Herapi SRLS
 *
 *	For informations email us at info@marketcloud.it
 *
 */

(function(module){
"use strict"

var request = require('superagent');
var Promise = require('bluebird');
var crypto = require('crypto');


var Marketcloud = {};

var Addresses = require('./src/addresses.js');
var Brands = require('./src/brands.js');
var Carts = require('./src/carts.js');
var Categories = require('./src/categories.js');
var Contents = require('./src/contents.js');
var Orders = require('./src/orders.js');
var Payments = require('./src/payments.js');
var Products = require('./src/products.js');
var Shippings = require('./src/shippings.js');
var Users = require('./src/users.js');


// Utility
/*var isNullOrUndefined = function(v) {
	return (v === null || 'undefined' === typeof v)
}*/

/*
 *
 *	[Client The client's instance]
 *
 *	@param {string} config.public_key The application's public key
 *	@param {string} config.secret_key The application's secret key
 *	
 * 
 */
Marketcloud.Client = function(config) {

	this.token = null;
	this.public_key = config.public_key;
	this.secret_key = config.secret_key;

	this.baseUrl = 'https://api.marketcloud.it';

	this.apiVersion = 'v0';

	// If this is true, then api responses with status code >= 400
	//  are rejected as errors.
	//  If set to false all responses from server are resolved
	//  
	//  In both cases, "failures" are rejected.
	this.rejectApiErrors = config.rejectApiErrors || true;

	// Resources
	this.addresses = new Addresses(this);
	this.brands = new Brands(this);
	this.carts = new Carts(this);
	this.categories = new Categories(this);
	this.contents = new Contents(this);
	//this.discounts = new Discounts(this); TODO
	this.orders = new Orders(this);
	this.payments = new Payments(this);
	
	this.products = new Products(this);
	this.shippings = new Shippings(this);
	//this.stores = new Stores(this); TODO
	
	this.users = new Users(this);

	this.RETRIES = 0;
	this.MAX_RETRIES = 2;

}

/*
*
* 	@returns {string} The base url for api calls
* 	e.g. https://api.marketcloud.it/v0
*/
Marketcloud.Client.prototype.getApiBaseUrl = function() {
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
Marketcloud.Client.prototype.requestFactory = function(config) {
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

				
				if (err){

					if (401 === err.response.statusCode){
						// The token expired
						// need to refresh it
						console.log("Token expired, must re-authenticate")
						return _this.authenticate()
							.then(function() {
								console.log("Re-authenticated after token expiration")
								return _this.requestFactory(config);
							});
					}

					if (err.response) {
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
						
					}
					else
						reject(err);

				}
				else
					resolve(response.body.data);
				
			

		})
	});

	
	
}

// Utility HTTP request
Marketcloud.Client.prototype._Get = function(endpoint, query) {
	return this.requestFactory({
		method: 'GET',
		endpoint: endpoint,
		query: query || {}
	})
}
// Utility HTTP request
Marketcloud.Client.prototype._Post = function(endpoint, data) {
	return this.requestFactory({
		method: 'POST',
		endpoint: endpoint,
		data: data || {}
	})
}

// Utility HTTP request
Marketcloud.Client.prototype._Put = function(endpoint, data) {
	return this.requestFactory({
		method: 'PUT',
		endpoint: endpoint,
		data: data || {}
	});
}


// Utility HTTP Patch request
Marketcloud.Client.prototype._Patch = function(endpoint, data) {
	return this.requestFactory({
		method: 'PATCH',
		endpoint: endpoint,
		data: data || {}
	})
}

// Utility HTTP Delete request
Marketcloud.Client.prototype._Delete = function(endpoint) {
	return this.requestFactory({
		method: 'DELETE',
		endpoint: endpoint
	})
}


// Utility, returns a formatted HTTP header
Marketcloud.Client.prototype.getAuthorizationHeader = function() {
	if (this.token)
		return this.public_key + ':' + this.token
	else
		return this.public_key
}

// Generates an auth Token from the credentials stored inside the client.
Marketcloud.Client.prototype.authenticate = function() {

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

				if (err){
					if (err.response) {
						// Packaging the error response in an error
						// TODO create ad-hoc errors
						var _err = new Error();
						for (var k in err.response.body.errors[0])
							_err[k] = err.response.body.errors[0][k];
						reject(_err);
					}
					else
						reject(err);

				}
				else{
					_this.token = response.body.token;
					resolve(response.body.data);
				}
				
			})
	})



}


// Handy reference to Bluebird so you don't have to
// require it again because of Node.
Marketcloud.Promise = Promise;




module.exports = Marketcloud;


})(module)