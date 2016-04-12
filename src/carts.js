module.exports = (function() {
	function Carts(master) {
		this.master = master;
	}

	Carts.prototype.list = function(query) {
		return this.master._Get('/carts', query);
	}

	Carts.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/carts/' + id, {});
	}

	Carts.prototype.create = function(data) {
		return this.master._Post('/carts', data)
	}

	Carts.prototype.add = function(id, items) {
		if (isNaN(id))
			throw new Error('id must be an integer.');

		if (!(items instanceof Array))
			throw new Error('items must be an array of line items');
		var payload = {
			op: "add",
			items: items
		}
		return this.master._Patch('/carts/' + id, payload)
	}

	Carts.prototype.remove = function(id, items) {
		if (isNaN(id))
			throw new Error('id must be an integer.')

		if (!(items instanceof Array))
			throw new Error('items must be an array of line items')


		var payload = {
			op: "remove",
			items: items
		}
		return this.master._Patch('/carts/' + id, payload)
	}

	Carts.prototype.update = function(id, items) {
		if (isNaN(id))
			throw new Error('id must be an integer.')

		if (!(items instanceof Array))
			throw new Error('items must be an array of line items')


		var payload = {
			op: "update",
			items: items
		}
		return this.master._Patch('/carts/' + id, payload)
	}

	Carts.prototype.delete = function(id) {
		return this.master._Delete('/carts/' + id)
	}

	return Carts;

})();