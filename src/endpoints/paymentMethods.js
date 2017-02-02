module.exports = (function() {

	var Resource = require('./resource.js');
	function PaymentMethods(master) {

		Resource.call(this,master);

		this.name = 'paymentMethods';
		this.endpoint = '/'+this.name;
	}



	PaymentMethods.prototype = new Resource();

	return PaymentMethods;

})();