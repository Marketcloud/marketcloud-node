module.exports = (function() {


	var Resource = require('./resource.js');
	function Users(master) {

		Resource.call(this,master);

		this.endpoint = '/users'
	}



	Users.prototype = new Resource();

	Users.prototype.authenticate = function(email, password) {
		var payload = {
			email: email,
			password: password
		}
		return this.master._Post('/users/authenticate', payload);
	}


	return Users;

})();