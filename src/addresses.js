
module.exports = (function() {
	



	var Resource = require('./resource.js');
	function Addresses(master) {

		Resource.call(this,master);

		this.endpoint = '/addresses'
	}



	Addresses.prototype = new Resource();

	return Addresses;

})();