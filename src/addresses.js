module.exports = (function() {
	function Addresses(master) {
		this.master = master;
	}

	Addresses.prototype.list = function(query) {
		return this.master._Get('/addresses', query);
	}

	Addresses.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/addresses/' + id, {});
	}

	Addresses.prototype.create = function(data) {
		return this.master._Post('/addresses', data)
	}

	Addresses.prototype.update = function(id, data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')

		return this.master._Put('/addresses/' + id, data)

	}

	Addresses.prototype.delete = function(id) {
		return this.master._Delete('/addresses/' + id)
	}

	return Addresses;

})();