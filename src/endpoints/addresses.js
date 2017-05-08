
module.exports = (function () {
  var Resource = require('./resource.js')
  function Addresses (master) {
    Resource.call(this, master)

    this.name = 'addresses'
    this.endpoint = '/' + this.name
  }

  Addresses.prototype = new Resource()

  return Addresses
})()
