
module.exports = (function() {
	function Payments(master) {
		this.master = master;


		this.Braintree = {
			generateClientToken : function() {
				return master._Post('/integrations/braintree/clientToken');
			},
			create : function(data) {
				data.method = 'Braintree';
				if (!data.hasOwnProperty('nonce'))
					throw new Error('Missing required attribute nonce');
				if (!data.hasOwnProperty('order_id'))
					throw new Error('Missing required attribute order_id');
			}
		};
		this.Stripe = {
			create : function(data) {
				data.method = 'Stripe';
				if (!data.hasOwnProperty('source'))
					throw new Error('Missing required attribute source');
				if (!data.hasOwnProperty('order_id'))
					throw new Error('Missing required attribute order_id');
			}
		};
	}

	
	Payments.prototype.create = function(data) {

		if (!data.hasOwnProperty('method'))
			throw new Error('Missing required attribute method');
		if (!data.hasOwnProperty('order_id'))
			throw new Error('Missing required attribute order_id');

		return this.master._Post('/payments', data)
	}

	return Payments;

})();