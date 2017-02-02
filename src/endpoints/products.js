module.exports = (function() {


	var Resource = require('./resource.js');
	function Products(master) {

		Resource.call(this,master);

		this.name = 'products';
		this.endpoint = '/'+this.name;
	}



	Products.prototype = new Resource();

	return Products;

})();


