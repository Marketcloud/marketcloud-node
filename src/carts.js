module.exports = (function() {

	var Resource = require('./resource.js');
	function Carts(master) {

		Resource.call(this,master);

		this.endpoint = '/carts'
	}



	Carts.prototype = new Resource();

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


	return Carts;

})();