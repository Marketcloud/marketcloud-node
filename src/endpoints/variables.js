module.exports = (function () {
  var Resource = require('./resource.js')
  function Variables (master) {
    Resource.call(this, master)

    this.name = 'variables'
    this.endpoint = '/' + this.name
  }

  Variables.prototype = new Resource()

  return Variables
})()
