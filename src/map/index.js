'use strict';

const debug = require('../debug');

const DefaultUI = require('./default-ui');
const DebugUI = require('./debug-ui');

// Automatically choose which UI strategy to use based on debug mode
module.exports = debug.enabled ? new DebugUI() : new DefaultUI();
