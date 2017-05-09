module.exports = (function () {
  'use strict'

  var Promise = require('bluebird')
  var crypto = require('crypto')
  var request = require('superagent')
  var path = require('path')
  var endpoints = require(path.join(__dirname, 'endpoints.js'))

  var VERSION = require('../package.json').version

  /*
   *
   *  [Client The client's instance]
   *
   *  @param {string} config.public_key The application's public key
   *  @param {string} config.secret_key The application's secret key
   *
   *
   */
  function Client (config) {
    this.token = null
    this.public_key = config.public_key
    this.secret_key = config.secret_key

    this.baseUrl = 'https://api.marketcloud.it'

    // Marketcloud's api is versioned by URL
    // for instance, the current api is api.marketcloud.it/v0/<endpoint>
    this.apiVersion = 'v0'

    // If this is true, then api responses with status code >= 400
    //  are rejected as errors.
    //  If set to false all responses from server are resolved
    //
    //  In both cases, "failures" are rejected.
    this.rejectApiErrors = config.rejectApiErrors || true

    // When the client is unable to re-authenticate for a number of times that
    // exceeds MAX_RETRIES
    this.throwErrorWhenOutOfRetries = config.throwErrorWhenOutOfRetries || true

    // Creating resources instances
    for (var endpointName in endpoints) {
      var e = new endpoints[endpointName](this)
      this[e.name] = e
    }

    this.RETRIES = 0
    this.MAX_RETRIES = 2

    // This is the property that will hold a reference to the last
    // request's configuration.
    this.LAST_REQUEST = null
  }

  /*
   *
   *  @returns {string} The base url for api calls
   *  e.g. https://api.marketcloud.it/v0
   */
  Client.prototype.getApiBaseUrl = function () {
    return this.baseUrl + '/' + this.apiVersion
  }
    /*
     *
     *  [requestFactory: Performs an HTTP request based on the configuration parameter]
     *
     *  @param {string} config.method The HTTP method 'PUT','POST','GET','PATCH' etc
     *  @param {object} config.data POST data to append to the request
     *  @param {object} config.query Query string object
     */
  Client.prototype.requestFactory = function (config) {
    var _this = this

    if (this.token === null) {
      return this.authenticate()
        .then(function () {
          return _this.requestFactory(config)
        })
    }

    return new Promise(function (resolve, reject) {
      // Initialize the superagent Request object
      var req = request(config.method, _this.getApiBaseUrl() + config.endpoint)

      // Addding authorization header
      req.set('Authorization', _this.getAuthorizationHeader())

      // Adding useful headers about SDK version, this helps us trace bugs
      // and eventually help users more efficiently
      req.set('X-sdk-variant', 'nodejs')
      req.set('X-sdk-version', VERSION)

      // Setting the request query object
      if (config.query) {
        req.query(config.query || {})
      }

      // Setting the body
      if (config.data) {
        req.send(config.data || {})
      }

      // For observability and testability
      _this.LAST_REQUEST = config

      // Firing the request
      req.end(function (err, response) {
        if (err) {
          if (err.response) {
            // This is an auth error. It might be due to the token's expiration
            // We retry the last request after authenticating.
            // If it still fails, then we reject.
            if (err.response.statusCode === 401 || err.response.statusCode === 403) {
              return _this.authenticate()
                .then(function () {
                  // Re authenticated after token expiration
                  return _this.requestFactory(config)
                    .then(function (response) {
                      resolve(response)
                    })
                    .catch(function (error) {
                      reject(error)
                    })
                })
                .catch(function (response) {
                  // Automatic re-authentication failed. Rejecting.
                  reject(response)
                })
            }

            // Packaging the error response in an error

            // This is most likely a response with status >= 400
            if (_this.rejectApiErrors) {
              // If the  option is true
              // then responses with status >= 400 are rejected as errors
              var _err = new Error()
              for (var k in err.response.body.errors[0]) { _err[k] = err.response.body.errors[0][k] }
              reject(_err)
            } else {
              // If the simple option is false
              // then responses with code >= 400 are resolved
              resolve(err.response.body.errors[0])
            }
          } else {
            // If the response is not defined, its most likely a netowrking error
            reject(err)
          }
        } else {
          // Refreshing retries
          _this.RETRIES = 0

          resolve(response.body)
        }
      })
    })
  }

  /*
  * @param {String} endpoint The endpoint to append to the base url for this request
  * @param {Object} query Object to be used as querystring
  */
  Client.prototype._Get = function (endpoint, query) {
    return this.requestFactory({
      method: 'GET',
      endpoint: endpoint,
      query: query || {}
    })
  }

  /*
  * @param {String} endpoint The endpoint to append to the base url for this request
  * @param {Object} data Object to be used as request body
  */
  Client.prototype._Post = function (endpoint, data) {
    return this.requestFactory({
      method: 'POST',
      endpoint: endpoint,
      data: data || {}
    })
  }

   /*
  * @param {String} endpoint The endpoint to append to the base url for this request
  * @param {Object} data Object to be used as request body
  *
  * @return {Promise}
  */
  Client.prototype._Put = function (endpoint, data) {
    return this.requestFactory({
      method: 'PUT',
      endpoint: endpoint,
      data: data || {}
    })
  }

   /*
  * @param {String} endpoint The endpoint to append to the base url for this request
  * @param {Object} data Object to be used as request body
  *
  * @return {Promise}
  */
  Client.prototype._Patch = function (endpoint, data) {
    return this.requestFactory({
      method: 'PATCH',
      endpoint: endpoint,
      data: data || {}
    })
  }

   /*
  * @param {String} endpoint The endpoint to append to the base url for this request
  *
  * @return {Promise}
  */
  Client.prototype._Delete = function (endpoint) {
    return this.requestFactory({
      method: 'DELETE',
      endpoint: endpoint
    })
  }

  /*
  *
  * @return {String} Returns a formatted HTTP header from authentication data
  *
  */
  Client.prototype.getAuthorizationHeader = function () {
    if (this.token) {
      return this.public_key + ':' + this.token
    } else {
      return this.public_key
    }
  }

  /*
  * Generates an auth Token from the credentials stored inside the client.
  *
  * @return {Promise}
  */
  Client.prototype.authenticate = function () {
    var now = Date.now()
    var h = '' + this.secret_key + now
    var hash = crypto.createHash('sha256')
      .update(h)
      .digest('base64')

    var _this = this
    var payload = {
      publicKey: _this.public_key,
      secretKey: hash,
      timestamp: now
    }
    return new Promise(function (resolve, reject) {
      request
        .post(_this.getApiBaseUrl() + '/tokens')
        .set('Authorization', _this.getAuthorizationHeader())
        .send(payload)
        .end(function (err, response) {
          if (err) {
            if (err.response) {
              // Packaging the error response in an error

              var _err = new Error()
              for (var k in err.response.body.errors[0]) {
                _err[k] = err.response.body.errors[0][k]
              }
              reject(_err)
            } else { reject(err) }
          } else {
            _this.token = response.body.token
            resolve(response.body.data)
          }
        })
    })
  }

  return Client
})()
