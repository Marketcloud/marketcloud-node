module.exports = (function () {
  var Resource = require('./resource.js')

  function Carts (master) {
    Resource.call(this, master)

    this.name = 'carts'
    this.endpoint = '/' + this.name
  }

  Carts.prototype = new Resource()

  Carts.prototype.add = function (id, items, options) {
    if (isNaN(id)) {
      throw new Error('id must be an integer.')
    }

    if (!(items instanceof Array)) {
      throw new Error('items must be an array of line items')
    }
    var payload = {
      op: 'add',
      items: items
    }
    return this.master._Patch('/carts/' + id, payload, options)
  }

  Carts.prototype.remove = function (id, items, options) {
    if (isNaN(id)) {
      throw new Error('id must be an integer.')
    }

    if (!(items instanceof Array)) {
      throw new Error('items must be an array of line items')
    }

    var payload = {
      op: 'remove',
      items: items
    }
    return this.master._Patch('/carts/' + id, payload, options)
  }

  Carts.prototype.update = function (id, items, options) {
    if (isNaN(id)) {
      throw new Error('id must be an integer.')
    }

    if (!(items instanceof Array)) {
      throw new Error('items must be an array of line items')
    }

    var payload = {
      op: 'update',
      items: items
    }
    return this.master._Patch('/carts/' + id, payload, options)
  }

  return Carts
})()
