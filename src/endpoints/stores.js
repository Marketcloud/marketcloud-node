module.exports = (function() {


	var Resource = require('./resource.js');
	function Stores(master) {

		Resource.call(this,master);

		this.name = 'stores';
		this.endpoint = '/'+this.name;
	}



	Stores.prototype = new Resource();

	return Stores;

})();


