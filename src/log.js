'use strict';

// Support log levels, see https://www.npmjs.com/package/loglevel#documentation
const log = require('loglevel');
const config = require('./config');
const debug = require('./debug');

// Users can override with log.setLevel('warn') or the 'debug', 'error', etc.
// This is just the default if nothing is passed to us.
log.setDefaultLevel('silent');

// Use 'debug' if we're in debug mode automatically
if (debug.enabled) {
  log.setLevel('debug', false);
}

// Support setting logging level via the query string ?loglevel=warn (or debug, error, info)
if (config.logLevel) {
  log.setLevel(config.logLevel, false);
}

module.exports = log;
