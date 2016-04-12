module.exports = (function() {
	function Orders(master) {
		this.master = master;
	}

	Orders.prototype.list = function(query) {
		return this.master._Get('/orders', query);
	}

	Orders.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/orders/' + id, {});
	}

	Orders.prototype.create = function(data) {
		return this.master._Post('/orders', data)
	}

	Orders.prototype.update = function(id, data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')

		return this.master._Put('/orders/' + id, data)
	}

	Orders.prototype.delete = function(id) {
		return this.master._Delete('/orders/' + id)
	}

	return Orders;

})();