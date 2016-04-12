module.exports = (function() {
	function Shippings(master) {
		this.master = master;
	}

	Shippings.prototype.list = function(query) {
		return this.master._Get('/shippings', query);
	}

	Shippings.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer. Got ' + typeof id)
		return this.master._Get('/shippings/' + id, {});
	}

	Shippings.prototype.create = function(data) {
		return this.master._Post('/shippings', data)
	}

	Shippings.prototype.update = function(id, data) {
		if (isNaN(id))
			throw new Error('id must be an integer. Got ' + typeof id)

		return this.master._Put('/shippings/' + id, data)
	}

	Shippings.prototype.delete = function(id) {
		return this.master._Delete('/shippings/' + id)
	}

	return Shippings;

})();