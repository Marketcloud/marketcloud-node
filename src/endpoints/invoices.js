module.exports = (function () {
  var Resource = require('./resource.js')
  function Invoices (master) {
    Resource.call(this, master)

    this.name = 'invoices'
    this.endpoint = '/' + this.name
  }

  Invoices.prototype = new Resource()

  return Invoices
})()
