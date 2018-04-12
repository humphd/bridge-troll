'use strict';

const log = require('./log');
const distance = require('./distance');
const debug = require('./debug');

// Expose `position` events when we move locations
const EventEmitter = require('events');
module.exports = new EventEmitter();

// Quadtree API docs at https://github.com/salsita/geo-tree
const GeoTree = require('geo-tree');
let set;

// Override of the geolocation API.
if (debug.enabled) {
  log.debug('Enabling fake-geolocation in geo.js');
  require('./fake-geolocation');
}

/**
 * Find all nearby points within a bounding box.  p1 and p2 should be diagonal
 * opposite points, defining the box:
 *
 *  +------------------------------p2
 *  |                              |
 *  |                              |
 *  p1-----------------------------+
 *
 * https://github.com/salsita/geo-tree#find
 */
module.exports.findWithin = (p1, p2) => {
  log.debug(`geo.findWithin p1=${p1}, p2=${p2}`);
  return set.find(p1, p2);
};

/**
 * Given a position (`lat`, `lng`), find all nearby points within a radius
 * of `radius` metres, or 1 KM if not specified.
 */
module.exports.findNearby = (lat, lng, radius) => {
  radius = isFinite(radius) ? parseFloat(radius) : distance.ONE_KM;
  log.debug(`geo.findNearby lat=${lat}, lng=${lng}, radius=${radius}m`);
  return set.find({ lat, lng }, radius, 'm');
};

/**
 * Add a record to our quadtree set for this item.
 */
module.exports.insert = (lat, lng, data) => set.insert(lat, lng, data);

/**
 * Catch-all for geolocation errors.
 */
const geoErrorHandler = err => {
  err = err || new Error('Error obtaining location data');
  log.error('Position Error', err);
  module.exports.emit('error', err);
};

const geoSuccessHandler = position => {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  log.debug(`Geolocation position update: lat=${lat}, lng=${lng}`);
  module.exports.emit('update', lat, lng);
};

/**
 * Browser Geolocation API - get initial position.
 * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
 */
module.exports.init = () => {
  if (!('geolocation' in navigator)) {
    geoErrorHandler(new Error('Unable to access geolocation information'));
    return;
  }

  set = new GeoTree();
  navigator.geolocation.watchPosition(geoSuccessHandler, geoErrorHandler);
  log.info('Starting to watch for geolocation position updates');
};
