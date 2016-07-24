module.exports = (function() {

	var Resource = require('./resource.js');
	function Categories(master) {

		Resource.call(this,master);

		this.endpoint = '/categories'
	}



	Categories.prototype = new Resource();

	return Categories;

})();