module.exports = (function() {

	var Resource = require('./resource.js');
	function Orders(master) {

		Resource.call(this,master);

		this.endpoint = '/orders'
	}



	Orders.prototype = new Resource();

	return Orders;

})();