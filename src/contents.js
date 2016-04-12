module.exports = (function() {
	function Contents(master) {
		this.master = master;
	}

	Contents.prototype.list = function(query) {
		return this.master._Get('/contents', query);
	}

	Contents.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/contents/' + id, {});
	}

	Contents.prototype.create = function(data) {
		return this.master._Post('/contents', data)
	}

	Contents.prototype.update = function(id, data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')

		return this.master._Put('/contents/' + id, data)
	}

	Contents.prototype.delete = function(id) {
		return this.master._Delete('/contents/' + id)
	}

	return Contents;

})();