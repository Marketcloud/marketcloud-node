module.exports = (function() {
	function Products(master) {
		this.master = master;
	}

	Products.prototype.list = function(query) {
		return this.master._Get('/products', query);
	}

	Products.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/products/' + id, {});
	}

	Products.prototype.create = function(data) {
		return this.master._Post('/products', data)
	}

	Products.prototype.update = function(id, data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')

		return this.master._Put('/products/' + id, data)
	}



	Products.prototype.delete = function(id) {
		return this.master._Delete('/products/' + id)
	}

	return Products;

})();


