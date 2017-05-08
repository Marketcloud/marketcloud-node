module.exports = (function () {
  var Resource = require('./resource.js')
  function Promotions (master) {
    Resource.call(this, master)

    this.name = 'promotions'
    this.endpoint = '/' + this.name
  }

  Promotions.prototype = new Resource()

  Promotions.prototype.getByCart = function (cartId) {
    if (typeof cartId !== 'number') {
      throw new Error('id must be an integer.')
    }

    return this.master._Get('/promotions/cart/' + cartId, {})
  }

  return Promotions
})()
