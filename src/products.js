module.exports = (function() {


	var Resource = require('./resource.js');
	function Products(master) {

		Resource.call(this,master);

		this.endpoint = '/products'
	}



	Products.prototype = new Resource();

	return Products;

})();


