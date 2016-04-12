module.exports = (function() {
	function Brands(master) {
		this.master = master;
	}

	Brands.prototype.list = function(query) {
		return this.master._Get('/brands', query);
	}

	Brands.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/brands/' + id, {});
	}

	Brands.prototype.create = function(data) {
		return this.master._Post('/brands', data)
	}

	Brands.prototype.update = function(id, data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')

		return this.master._Put('/brands/' + id, data)

	}

	Brands.prototype.delete = function(id) {
		return this.master._Delete('/brands/' + id)
	}

	return Brands;

})();
