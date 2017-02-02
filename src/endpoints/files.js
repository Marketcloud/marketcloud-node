module.exports = (function() {

	var Resource = require('./resource.js');
	function Files(master) {

		Resource.call(this,master);

		this.name = 'files';
		this.endpoint = '/'+this.name;
	}



	Files.prototype = new Resource();

	return Files;

})();