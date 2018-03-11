'use strict';

// Support log levels, see https://www.npmjs.com/package/loglevel#documentation
var log = require('loglevel');

// Users can override with log.setLevel('warn') or the 'debug', 'error', etc.
// This is just the default if nothing is passed to us.
log.setDefaultLevel('silent');

module.exports = log;
