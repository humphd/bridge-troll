'use strict';

// Support log levels, see https://www.npmjs.com/package/loglevel#documentation
const log = require('loglevel');
const debug = require('./debug');

// Use 'debug' if we're in debug mode automatically
if (debug.enabled) {
  log.setLevel('debug', false);
}

// Support setting logging level via the query string ?loglevel=warn (or debug, error, info)
let queryString = document.location.search;
let matches = /loglevel=([^&]+)/.exec(queryString);
let logLevel = matches && matches[1];
if (logLevel) {
  log.setLevel(logLevel, false);
}

// Users can override with log.setLevel('warn') or the 'debug', 'error', etc.
// This is just the default if nothing is passed to us.
log.setDefaultLevel('silent');

module.exports = log;
