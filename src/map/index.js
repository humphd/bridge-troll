'use strict';

const debug = require('../debug');

// We need leaflet's CSS included before its JS
require('../../node_modules/leaflet/dist/leaflet.css');

const DefaultUI = require('./default-ui');
const DebugUI = require('./debug-ui');

// Automatically choose which UI strategy to use based on debug mode
module.exports = debug.enabled ? new DebugUI() : new DefaultUI();
