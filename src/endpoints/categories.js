module.exports = (function() {

	var Resource = require('./resource.js');
	function Categories(master) {

		Resource.call(this,master);

		this.name = 'categories';
		this.endpoint = '/'+this.name;
	}



	Categories.prototype = new Resource();

	return Categories;

})();