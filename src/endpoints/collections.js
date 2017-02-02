module.exports = (function() {

	var Resource = require('./resource.js');
	function Collections(master) {

		Resource.call(this,master);

		this.name = 'collections';
		this.endpoint = '/'+this.name;
	}



	Collections.prototype = new Resource();

	return Collections;

})();