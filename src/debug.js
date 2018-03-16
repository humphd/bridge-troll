'use strict';

// If the app is started with the FAKE_GEO environment variable set to 1
// we enable debug mode.
module.exports.enabled = process.env.FAKE_GEO == 1;
