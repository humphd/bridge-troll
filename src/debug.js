'use strict';

// If the app is started with the DEBUG environment variable set to 1
// we enable debug mode.
module.exports.enabled = process.env.DEBUG == 1;
