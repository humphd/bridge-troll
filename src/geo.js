'use strict';

const log = require('./log');

// Expose `position` events when we move locations
const EventEmitter = require('events');
module.exports = new EventEmitter();

// Quadtree API docs at https://github.com/salsita/geo-tree
const GeoTree = require('geo-tree');
const set = new GeoTree();

// Allow manual override of the geolocation API.  Use FAKE_GEO=1
if (process.env.FAKE_GEO == 1) {
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
const ONE_KM = 1000;
module.exports.findNearby = (lat, lng, radius) => {
  radius = isFinite(radius) ? radius : ONE_KM;
  log.debug(`geo.findNearby lat=${lat}, lng=${lng}, radius=${radius}m`);
  return set.find({ lat, lng }, radius, 'm');
};

/**
 * Browser Geolocation API - watch for live updates to position.
 * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
 */
module.exports.watchPosition = () => {
  if (!('geolocation' in navigator)) {
    log.error('Unable to access geolocation information');
    // TODO: should probably emit an `error` event or something
    return;
  }

  let success = position => {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    log.info(`Geolocation position update: lat=${lat}, lng=${lng}`);
    module.exports.emit('position', lat, lng);
  };

  let error = err => {
    log.error('Error obtaining geolocation position info', err);
  };

  navigator.geolocation.watchPosition(success, error);
  log.info('Starting to watch for geolocation position updates');
};

/**
 * Add a record to our quadtree set for this item.
 */
module.exports.insert = (lat, lng, data) => set.insert(lat, lng, data);

