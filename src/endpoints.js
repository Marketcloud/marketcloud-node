'use strict'

var path = require('path')
var fs = require('fs')

var endpoints = {}

fs
  .readdirSync(path.join(__dirname, 'endpoints'))
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'resource.js')
  })
  .forEach(function (file) {
    var name = file.replace('.js', '')

    endpoints[name] = require(path.join(__dirname, 'endpoints', file))
  })

module.exports = endpoints
