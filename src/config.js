'use strict';

const qs = require('query-string');

// Expose all values on query string as an object
module.exports = qs.parse(location.search);
