/*
*	Marketcloud NodeJS SDK
*   http://www.marketcloud.it
*
*	Copyright (c) 2016 Herapi SRLS
*
*	For informations info@marketcloud.it
*
*/


var request = require('superagent');
var promise = require('bluebird');
var crypto = require('crypto');


var API_BASE_URL = 'http://api.marketcloud.it/v0';

var Marketcloud = {}

// Utility
var isNullOrUndefined = function(v) {
	return (v === null || 'undefined' === typeof v)
}

// Client class definition
Marketcloud.Client =  function(config){

	this.token = null;
	this.public_key  = config.public_key;
	this.secret_key  = config.secret_key;

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
	//this.paymentmethods = new PaymentMethods(this)
	this.products = new Products(this);
	this.shippings = new Shippings(this);
	//this.shipment = new Shipment(this); TODO
	//this.stores = new Stores(this); TODO
	//this.taxes = new Stores(this); TODO
	this.users = new Users(this);

}


Marketcloud.Client.prototype._Get = function(endpoint,query) {
	var _this = this;
	
	var doTheCall = function() {
	return new Promise(function(resolve,reject){
			request
			.get(API_BASE_URL+endpoint)
			.set('Authorization',_this.getAuthorizationHeader())
			.query(query || {})
			.end(function(err,response){
				if (err){
					if (response)
						reject(response.body)
					else
						reject(null,err)
				}
				else
					resolve(response.body)
			})
		})
	}

	if (this.secret_key !== null && isNullOrUndefined(this.token)){
		return this.authenticate()
			.then(function(response){
				return doTheCall()
			});
	} else {
		return doTheCall()
	}
}
Marketcloud.Client.prototype._Post = function(endpoint,data,options) {
	var _this = this;

	
	var doTheCall = function() {
	return new Promise(function(resolve,reject){
			request
			.post(API_BASE_URL+endpoint)
			.set('Authorization',_this.getAuthorizationHeader())
			.send(data || {})
			.end(function(err,response){
				if (err){
					if (response)
						reject(response.body)
					else
						reject(null,err)
				}
				else
					resolve(response.body)
			})
		})
	}

	if (this.secret_key !== null && isNullOrUndefined(this.token)){
		return this.authenticate()
			.then(function(response){
				return doTheCall()
			});
	} else {
		return doTheCall()
	}
}
Marketcloud.Client.prototype._Put = function(endpoint,data) {
	var _this = this;
	var doTheCall = function() {
	return new Promise(function(resolve,reject){
			request
			.put(API_BASE_URL+endpoint)
			.set('Authorization',_this.getAuthorizationHeader())
			.send(data || {})
			.end(function(err,response){
				if (err){
					if (response)
						reject(response.body)
					else
						reject(null,err)
				}
				else
					resolve(response.body)
			})
		})
	}

	if (this.secret_key !== null && isNullOrUndefined(this.token)){
		return this.authenticate()
			.then(function(response){
				return doTheCall()
			});
	} else {
		return doTheCall()
	}
}
Marketcloud.Client.prototype._Patch = function(endpoint,data) {
	var _this = this;
	var doTheCall = function() {
		return new Promise(function(resolve,reject){
				request
				.patch(API_BASE_URL+endpoint)
				.set('Authorization',_this.getAuthorizationHeader())
				.send(data || {})
				.end(function(err,response){
					if (err){
					if (response)
						reject(response.body)
					else
						reject(null,err)
				}
					else
						resolve(response.body)
				})
			})
	}

	if (this.secret_key !== null && this.token === null){
		return this.authenticate()
			.then(function(response){
				return doTheCall()
			});
	} else {
		return doTheCall()
	}
}
Marketcloud.Client.prototype._Delete = function(endpoint) {
	var _this = this;
	

	var doTheCall = function(){
		return new Promise(function(resolve,reject){
				request
				.del(API_BASE_URL+endpoint)
				.set('Authorization',_this.getAuthorizationHeader())
				.end(function(err,response){
					if (err){
					if (response)
						reject(response.body)
					else
						reject(null,err)
				}
					else
						resolve(response.body)
				})
		})
	}

	if (this.secret_key !== null && this.token === null){
		return this.authenticate()
			.then(function(response){
				return doTheCall()
			});
	} else {
		return doTheCall()
	}
}




Marketcloud.Client.prototype.getAuthorizationHeader = function() {
	if (this.token) 
		return this.public_key+':'+this.token
	else 
		return this.public_key
	
}


Marketcloud.Client.prototype.authenticate = function() {

	var now = Date.now();
	var h = ""+this.secret_key+now;
	var hash = crypto.createHash('sha256')
		  	  		 .update(h)
		      		 .digest('base64');

	var that = this;
	var payload = {
		publicKey : that.public_key,
		secretKey : hash,
		timestamp : now
	}
	return new Promise(function(resolve,reject){
		request
			.post(API_BASE_URL+'/tokens')
			.set('Authorization',that.getAuthorizationHeader())
			.send(payload)
			.end(function(err,response){
				if (err){
					if (response)
						reject(response.body)
					else
						reject(null,err)
				}
				else{
					that.token = response.body.token
					resolve(response.body)
				}
			})
	})
	


}

Addresses = (function(){
	function Addresses(master) {
		this.master = master;
	}

	Addresses.prototype.list = function(query) {
		return this.master._Get('/addresses',query);
	}

	Addresses.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/addresses/'+id,{});
	}

	Addresses.prototype.create = function(data) {
		return this.master._Post('/addresses',data)
	}

	Addresses.prototype.update = function(id,data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Put('/addresses/'+id,data)
	}

	Addresses.prototype.delete = function(id) {
		return this.master._Delete('/addresses/'+id)
	}

	return Addresses;

})();
Brands = (function(){
	function Brands(master) {
		this.master = master;
	}

	Brands.prototype.list = function(query) {
		return this.master._Get('/brands',query);
	}

	Brands.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/brands/'+id,{});
	}

	Brands.prototype.create = function(data) {
		return this.master._Post('/brands',data)
	}

	Brands.prototype.update = function(id,data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Put('/brands/'+id,data)
	}

	Brands.prototype.delete = function(id) {
		return this.master._Delete('/brands/'+id)
	}

	return Brands;

})();


Carts = (function(){
	function Carts(master) {
		this.master = master;
	}

	Carts.prototype.list = function(query) {
		return this.master._Get('/carts',query);
	}

	Carts.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/carts/'+id,{});
	}

	Carts.prototype.create = function(data) {
		return this.master._Post('/carts',data)
	}

	Carts.prototype.add = function(id,items) {
		if (isNaN(id))
			throw new Error('id must be an integer.');

		if (!(items instanceof Array))
			throw new Error('items must be an array of line items');
		var payload = {
			op : "add",
			items : items
		}
		return this.master._Patch('/carts/'+id,payload)
	}

	Carts.prototype.remove = function(id,items) {
		if (isNaN(id))
			throw new Error('id must be an integer.')

		if (!(items instanceof Array))
			throw new Error('items must be an array of line items')


		var payload = {
			op : "remove",
			items : items
		}
		return this.master._Patch('/carts/'+id,payload)
	}

	Carts.prototype.update = function(id,items) {
		if (isNaN(id))
			throw new Error('id must be an integer.')

		if (!(items instanceof Array))
			throw new Error('items must be an array of line items')


		var payload = {
			op : "update",
			items : items
		}
		return this.master._Patch('/carts/'+id,payload)
	}

	Carts.prototype.delete = function(id) {
		return this.master._Delete('/carts/'+id)
	}

	return Carts;

})();

Categories = (function(){
	function Categories(master) {
		this.master = master;
	}

	Categories.prototype.list = function(query) {
		return this.master._Get('/categories',query);
	}

	Categories.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/categories/'+id,{});
	}

	Categories.prototype.create = function(data) {
		return this.master._Post('/categories',data)
	}

	Categories.prototype.update = function(id,data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Put('/categories/'+id,data)
	}

	Categories.prototype.patch = function(id,data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Patch('/categories/'+id,data)
	}

	Categories.prototype.delete = function(id) {
		return this.master._Delete('/categories/'+id)
	}

	return Categories;

})();
Contents = (function(){
	function Contents(master) {
		this.master = master;
	}

	Contents.prototype.list = function(query) {
		return this.master._Get('/contents',query);
	}

	Contents.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/contents/'+id,{});
	}

	Contents.prototype.create = function(data) {
		return this.master._Post('/contents',data)
	}

	Contents.prototype.update = function(id,data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Put('/contents/'+id,data)
	}

	Contents.prototype.delete = function(id) {
		return this.master._Delete('/contents/'+id)
	}

	return Contents;

})();


Orders = (function(){
	function Orders(master) {
		this.master = master;
	}

	Orders.prototype.list = function(query) {
		return this.master._Get('/orders',query);
	}

	Orders.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/orders/'+id,{});
	}

	Orders.prototype.create = function(data) {
		/**
		 * {
		 * 	shipping_address_id 	: Int,
		 * 	billing_address_id 		: Int,
		 * 	user_id					: Int, //Optional
		 * 	items					: Array<LineItem>,
		 * 	state					: String in Enum, //Optional, defaults to 'created'
		 * 	payment					: Object
		 * }
		 */
		
		/*
		*/
		 
		return this.master._Post('/orders',data)
	}

	Orders.prototype.update = function(id,data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Put('/orders/'+id,data)
	}

	Orders.prototype.delete = function(id) {
		return this.master._Delete('/orders/'+id)
	}

	return Orders;

})();


Products = (function(){
	function Products(master) {
		this.master = master;
	}

	Products.prototype.list = function(query) {
		return this.master._Get('/products',query);
	}

	Products.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/products/'+id,{});
	}

	Products.prototype.create = function(data) {
		return this.master._Post('/products',data)
	}

	Products.prototype.update = function(id,data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Put('/products/'+id,data)
	}

	Products.prototype.patch = function(id,data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Patch('/products/'+id,data)
	}

	Products.prototype.delete = function(id) {
		return this.master._Delete('/products/'+id)
	}

	return Products;

})();

Shippings = (function(){
	function Shippings(master) {
		this.master = master;
	}

	Shippings.prototype.list = function(query) {
		return this.master._Get('/shippings',query);
	}

	Shippings.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/shippings/'+id,{});
	}

	Shippings.prototype.create = function(data) {
		return this.master._Post('/shippings',data)
	}

	Shippings.prototype.update = function(id,data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Put('/shippings/'+id,data)
	}

	Shippings.prototype.delete = function(id) {
		return this.master._Delete('/shippings/'+id)
	}

	return Shippings;

})();




Users = (function(){
	function Users(master) {
		this.master = master;
	}

	Users.prototype.list = function(query) {
		return this.master._Get('/users',query);
	}

	Users.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/users/'+id,{});
	}

	Users.prototype.create = function(data) {
		return this.master._Post('/users',data)
	}

	Users.prototype.update = function(id,data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Put('/users/'+id,data)
	}
	Users.prototype.patch = function(id,data) {
			if (isNaN(id))
				throw new Error('id must be an integer.')
			return this.master._Patch('/users/'+id,data)
		}

	Users.prototype.authenticate = function(email,password) {
		var payload = {
			email : email,
			password : password
		}
		return this.master._Post('/users/authenticate',payload);
	}

	Users.prototype.delete = function(id) {
		return this.master._Delete('/users/'+id)
	}

	return Users;

})();



Marketcloud.Promise = promise;

module.exports = Marketcloud;
