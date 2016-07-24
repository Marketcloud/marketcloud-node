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


var request = require('superagent');
var Promise = require('bluebird');
var crypto = require('crypto');


var API_BASE_URL = 'https://api.marketcloud.it/v0';

var Marketcloud = {};

var Addresses = require('./src/addresses.js');
var Brands = require('./src/brands.js');
var Carts = require('./src/carts.js');
var Categories = require('./src/categories.js');
var Contents = require('./src/contents.js');
var Orders = require('./src/orders.js');
var Products = require('./src/products.js');
var Shippings = require('./src/shippings.js');
var Users = require('./src/users.js');

// Utility
var isNullOrUndefined = function(v) {
	return (v === null || 'undefined' === typeof v)
}

// Client class definition
Marketcloud.Client = function(config) {

	this.token = null;
	this.public_key = config.public_key;
	this.secret_key = config.secret_key;

	// Resources
	this.products = new Products(this);
	this.addresses = new Addresses(this);
	this.brands = new Brands(this);
	this.carts = new Carts(this);
	this.categories = new Categories(this);
	this.contents = new Contents(this);
	//this.discounts = new Discounts(this); TODO
	this.orders = new Orders(this);
	//this.payments = new Payments(this);
	//this.paymentMethods = new PaymentMethods(this)
	this.products = new Products(this);
	this.shippings = new Shippings(this);
	//this.shipment = new Shipment(this); TODO
	//this.stores = new Stores(this); TODO
	//this.taxes = new Taxes(this); TODO
	this.users = new Users(this);

	this.RETRIES = 0;
	this.MAX_RETRIES = 2;

}

Marketcloud.Client.prototype.requestFactory = function(config) {
	var _this = this;


	var the_promise = new Promise(function(resolve, reject) {
		var req = request(config.method, API_BASE_URL + config.endpoint);

		req.set('Authorization', _this.getAuthorizationHeader());

		if (config.query)
			req.query(config.query || {});

		if (config.data)
			req.send(config.data || {});


		req.end(function(err, response) {
			if (response && response.status === 401) {

				// Token may be expired, or the service is currently unavailable
				// Retrying
				if (_this.RETRIES <= _this.MAX_RETRIES) {
					_this.RETRIES += 1;
					console.log("Retrying ("+_this.RETRIES+" attempt)")
					

					
					return _this.authenticate()
						.then(function(response) {
							//Retry was successful, resetting retries
							if (response.code < 400){
								_this.RETRIES = 0;
							}
							return _this.requestFactory(config);
							
						})
						.catch(function(response){
							reject(new Error('Unable to re-authenticate the client.'))
						})
				} else {
					console.log("Reached maximum number of retries. Quitting...")
					reject(new Error("Reached maximum number of retries."))
				}
			} else {
				if (err) {
					if (response && response.body){
						console.log(response.body)
						resolve(response.body.errors[0])
					}
					else
						reject(err)
				} else {
					resolve(response.body.data)
				}
			}

		})
	});

	if (this.secret_key !== null && isNullOrUndefined(this.token)) {
		return this.authenticate()
			.then(function(response) {
				return the_promise;
			});
	} else {
		return the_promise;
	}
	
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
Marketcloud.Client.prototype._Post = function(endpoint, data, options) {
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


// Utility that returns a formatted HTTP header
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

	var that = this;
	var payload = {
		publicKey: that.public_key,
		secretKey: hash,
		timestamp: now
	}
	return new Promise(function(resolve, reject) {
		request
			.post(API_BASE_URL + '/tokens')
			.set('Authorization', that.getAuthorizationHeader())
			.send(payload)
			.end(function(err, response) {
				if (err) {
					if (response)
						resolve(response.body.errors[0])
					else
						reject(err)
				} else {
					that.token = response.body.token
					resolve(response.body.data)
				}
			})
	})



}


// Handy reference to Bluebird
Marketcloud.Promise = Promise;




module.exports = Marketcloud;


})(module)