module.exports = (function() {
	function Users(master) {
		this.master = master;
	}

	Users.prototype.list = function(query) {
		return this.master._Get('/users', query);
	}

	Users.prototype.getById = function(id) {
		if (isNaN(id))
			throw new Error('id must be an integer.')
		return this.master._Get('/users/' + id, {});
	}

	Users.prototype.create = function(data) {
		return this.master._Post('/users', data)
	}

	Users.prototype.update = function(id, data) {
		if (isNaN(id))
			throw new Error('id must be an integer.')


		return this.master._Put('/users/' + id, data)

	}


	Users.prototype.authenticate = function(email, password) {
		var payload = {
			email: email,
			password: password
		}
		return this.master._Post('/users/authenticate', payload);
	}

	Users.prototype.delete = function(id) {
		return this.master._Delete('/users/' + id)
	}

	return Users;

})();