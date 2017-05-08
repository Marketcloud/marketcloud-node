module.exports = (function () {
  var Resource = require('./resource.js')
  function Coupons (master) {
    Resource.call(this, master)

    this.name = 'coupons'
    this.endpoint = '/' + this.name
  }

  Coupons.prototype = new Resource()

  return Coupons
})()
