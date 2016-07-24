/*
	@param this.endpoint {String} The path of this endpoint, e.g. /products
	@params this.config.additionalEndpoints Array<Function> An array of additional functions
 */
module.exports = (function() {


	function Resource(master) {

		//Reference to the client
		this.master = master;

	}

	

	Resource.prototype.list = function(query) {
		return this.master._Get(this.endpoint, query);
	}

	Resource.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get(this.endpoint + '/' + id, {});
	}

	Resource.prototype.create = function(data) {
		return this.master._Post(this.endpoint, data)
	}

	Resource.prototype.update = function(id, data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')

		return this.master._Put(this.endpoint + '/' + id, data)
	}

	Resource.prototype.delete = function(id) {
		return this.master._Delete(this.endpoint + '/' + id)
	}

	return Resource;

})();
