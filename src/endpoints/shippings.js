module.exports = (function () {
  var Resource = require('./resource.js')
  function Shippings (master) {
    Resource.call(this, master)

    this.name = 'shippings'
    this.endpoint = '/' + this.name
  }

  Shippings.prototype = new Resource()

  Shippings.prototype.getByCartId = function (cart_id, options) {
    if (isNaN(cart_id)) {
      throw new Error('id must be an integer.')
    }

    return this.master._Get('/shippings/cart/' + cart_id, options)
  }

  return Shippings
})()
