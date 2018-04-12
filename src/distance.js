'use strict';

const debug = require('./debug');
const config = require('./config');

// One KM in m
module.exports.ONE_KM = 1000;

/**
 * The distance from the current location to a bridge in order for them to
 * collide. We also support using ?collision=250 in debug mode to override.
 */
const DEFAULT_COLLISION_M = 50;
module.exports.COLLISION_M =
  debug.enabled && config.collision ? config.collision : DEFAULT_COLLISION_M;
