module.exports = (function () {
  var Resource = require('./resource.js')
  function Taxes (master) {
    Resource.call(this, master)

    this.name = 'taxes'
    this.endpoint = '/' + this.name
  }

  Taxes.prototype = new Resource()

  return Taxes
})()
