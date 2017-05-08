module.exports = (function () {
  function Application (master) {
    this.master = master
    this.name = 'application'
    this.endpoint = '/' + this.name
  }

  Application.prototype.get = function () {
    return this.master._Get('/application')
  }

  return Application
})()
