module.exports = (function() {
	function Categories(master) {
		this.master = master;
	}

	Categories.prototype.list = function(query) {
		return this.master._Get('/categories', query);
	}

	Categories.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/categories/' + id, {});
	}

	Categories.prototype.create = function(data) {
		return this.master._Post('/categories', data)
	}

	Categories.prototype.update = function(id, data) {
		if (isNaN(id))
			throw new Error('id must be an integer.');

		return this.master._Put('/categories/' + id, data)

	}


	Categories.prototype.delete = function(id) {
		return this.master._Delete('/categories/' + id)
	}

	return Categories;

})();