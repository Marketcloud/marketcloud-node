module.exports = (function() {


	var Resource = require('./resource.js');
	function Shippings(master) {

		Resource.call(this,master);

		this.endpoint = '/shippings'
	}



	Shippings.prototype = new Resource();

	return Shippings;

})();