module.exports = (function() {

	var Resource = require('./resource.js');
	function Promotions(master) {

		Resource.call(this,master);

		this.name = 'promotions';
		this.endpoint = '/'+this.name;
	}



	Promotions.prototype = new Resource();

	Promotions.prototype.getByPromotionId = function(promotion_id) {
		if (isNaN(id))
			throw new Error('id must be an integer.');

		return this.master._Patch('/promotions/cart/' + cart_id)
	}




	return Promotions;

})();