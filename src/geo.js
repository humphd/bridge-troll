'use strict';

const log = require('./log');

// Expose `bridge` events when we pass nearby known bridge(s)
const EventEmitter = require('events');
module.exports = new EventEmitter();

const Bridge = require('./bridge');
const bridges = {};

// Quadtree API docs at https://github.com/salsita/geo-tree
const GeoTree = require('geo-tree');
const set = new GeoTree();

/**
 * Find all bridges within a bounding box.  p1 and p2 should be diagonal
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
  return set.find(p1, p2).map(id => bridges[id]);
};

/**
 * Given a position (`lat`, `lng`), find all bridges within a radius
 * of `radius` metres, or 1 KM if not specified.
 */
const ONE_KM = 1000;
const find = (lat, lng, radius) => {
  radius = isFinite(radius) ? radius : ONE_KM;
  log.debug(`geo.find lat=${lat}, lng=${lng}, radius=${radius}m`);
  return set.find({ lat, lng }, radius, 'm');
};

/**
 * Browser Geolocation API - watch for live updates to position
 */
const watchPosition = () => {
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

    let nearby = find(lat, lng);
    if (nearby.length) {
      log.info('Found nearby bridge(s)', nearby);
      module.exports.emit('bridges', nearby);
    }
  };

  let error = err => {
    log.error('Error obtaining geolocation position info', err);
  };

  navigator.geolocation.watchPosition(success, error);
  log.info('Starting to watch for geolocation position updates');
};

/**
 * Setup the geo data set.  Import raw bridge records, convert to Bridge
 * instance objects, and add to geo quadtree.  Also begin watching for
 * live updates to current geolocation positioning.
 */
module.exports.init = () => {
  // Process our raw bridge data into an in-memory db and geo quadtree
  require('./bridges').forEach(record => {
    let bridge = Bridge.fromObject(record);

    // Deal with invalid data in the dataset (not all bridges have lat/lng)
    if (!(bridge.id && bridge.lat && bridge.lng)) {
      log.warn(
        `Bridge missing data, skipping: id=${bridge.id}, lat=${
          bridge.lat
        }, lng=${bridge.lng}`
      );
      return;
    }

    // Record this bridge object in our database
    bridges[bridge.id] = bridge;

    // Also add it to our geo set with id as key
    set.insert({
      lat: bridge.lat,
      lng: bridge.lng,
      data: bridge.id
    });

    log.debug('Added Bridge', bridge);
  });

  // Start watching for position changes
  watchPosition();
};
