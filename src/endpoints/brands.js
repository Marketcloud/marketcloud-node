module.exports = (function () {
  var Resource = require('./resource.js')
  function Brands (master) {
    Resource.call(this, master)

    this.name = 'brands'
    this.endpoint = '/' + this.name
  }

  Brands.prototype = new Resource()

  return Brands
})()
