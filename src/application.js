module.exports = (function() {

	var Resource = require('./resource.js');
	function Application(master) {
		this.master = master;
	}

	Application.prototype.get = function() {
		return this.master._Get('/application');
	}

	return Application;

})();