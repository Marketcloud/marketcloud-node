module.exports = (function () {
  var Resource = require('./resource.js')
  function Promotions (master) {
    Resource.call(this, master)

    this.name = 'promotions'
    this.endpoint = '/' + this.name
  }

  Promotions.prototype = new Resource()

  Promotions.prototype.getByCart = function (cartId, options) {
    
    if ("number" !== typeof(cartId)) {
      throw new TypeError('id must be an integer number, got ' + typeof(id))
    }

    return this.master._Get('/promotions/cart/' + cartId, {}, options)
  }

  return Promotions
})()
