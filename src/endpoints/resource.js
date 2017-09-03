/*
  @param this.endpoint {String} The path of this endpoint, e.g. /products
  @params this.config.additionalEndpoints Array<Function> An array of additional functions
 */
module.exports = (function () {
  function Resource (master) {
    // Reference to the client
    this.master = master
  }

  Resource.prototype.list = function (query, options) {
    return this.master._Get(this.endpoint, query, options)
  }

  Resource.prototype.getById = function (id, options) {
    if (isNaN(id)) {
      throw new Error('id must be an integer.')
    }
    return this.master._Get(this.endpoint + '/' + id, {}, options)
  }

  Resource.prototype.create = function (data, options) {
    return this.master._Post(this.endpoint, data)
  }

  Resource.prototype.update = function (id, data, options) {
    if (isNaN(id)) {
      throw new TypeError('id must be an integer number, got ' + typeof(id))
    }

    return this.master._Put(this.endpoint + '/' + id, data, options)
  }

  Resource.prototype.delete = function (id, options) {
    return this.master._Delete(this.endpoint + '/' + id, options)
  }

  return Resource
})()
