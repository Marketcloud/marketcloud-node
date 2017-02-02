/*
 *	Marketcloud NodeJS SDK
 *   	http://www.marketcloud.it
 *
 *	Copyright (c) 2016 Herapi SRLS
 *
 *	For informations email us at info@marketcloud.it
 *
 */

"use strict"

var request = require('superagent'),
	Promise = require('bluebird'),
	path	= require('path');

// Module
var Marketcloud = {};

// REST client
Marketcloud.Client = require(path.join(__dirname,'src','client'))


// Handy reference to Bluebird so you don't have to
// require it again because of Node.
Marketcloud.Promise = Promise;

// Handy reference to Superagent
Marketcloud.Request = request;




module.exports = Marketcloud;
