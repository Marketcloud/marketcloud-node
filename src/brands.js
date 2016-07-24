module.exports = (function() {



	var Resource = require('./resource.js');
	function Brands(master) {

		Resource.call(this,master);

		this.endpoint = '/brands'
	}



	Brands.prototype = new Resource();



	return Brands;

})();
