module.exports = (function() {


	var Resource = require('./resource.js');
	function Shippings(master) {

		Resource.call(this,master);

		this.name = 'shippings';
		this.endpoint = '/'+this.name;
	}



	Shippings.prototype = new Resource();

	return Shippings;

})();