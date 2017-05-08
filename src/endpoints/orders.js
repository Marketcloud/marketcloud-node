module.exports = (function () {
  var Resource = require('./resource.js')
  function Orders (master) {
    Resource.call(this, master)

    this.name = 'orders'
    this.endpoint = '/' + this.name
  }

  Orders.prototype = new Resource()

  return Orders
})()
