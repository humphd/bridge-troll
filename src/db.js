'use strict';

// See https://github.com/jakearchibald/idb-keyval#usage.
// Also, using .default to work around webpack module loading bug:
// https://github.com/jakearchibald/idb-keyval/issues/25
module.exports = require('idb-keyval').default;
