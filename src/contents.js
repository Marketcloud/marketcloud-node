module.exports = (function() {

	var Resource = require('./resource.js');
	function Contents(master) {

		Resource.call(this,master);

		this.endpoint = '/contents'
	}



	Contents.prototype = new Resource();

	return Contents;

})();