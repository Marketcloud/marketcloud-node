module.exports = (function () {
  var Resource = require('./resource.js')
  function Contents (master) {
    Resource.call(this, master)

    this.name = 'contents'
    this.endpoint = '/' + this.name
  }

  Contents.prototype = new Resource()

  return Contents
})()
