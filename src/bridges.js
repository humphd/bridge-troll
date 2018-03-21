'use strict';

const TrollBridge = require('./troll-bridge');
const distance = require('./distance');
const geo = require('./geo');
const log = require('./log');

// See https://github.com/jakearchibald/idb-keyval#usage.
// Also, using .default to work around webpack module loading bug:
// https://github.com/jakearchibald/idb-keyval/issues/25
const idbKeyval = require('idb-keyval').default;

const bridgeData = require('../data/bridge-data.json');
const bridges = {};

// Process our raw bridge data into an in-memory db and geo quadtree
module.exports.init = () => {
  bridgeData.forEach(record => {
    let bridge = TrollBridge.fromObject(record);

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
    geo.insert({
      lat: bridge.lat,
      lng: bridge.lng,
      data: bridge.id
    });

    log.debug('Added Bridge', bridge);
  });
};

module.exports.unlockNearby = (lat, lng) => {
  // Look nearby for any bridges to collect
  geo.findNearby(lat, lng, distance.COLLISION_M).forEach(id => {
    let bridge = bridges[id];
    log.debug('Found nearby bridge', bridge);
    bridge.unlock();
  });
};

module.exports.showWithin = (p1, p2) => {
  geo.findWithin(p1, p2).forEach(id => {
    let bridge = bridges[id];
    log.debug('Found bridge within map bounds', bridge);
    // Add an icon to the map for this bridge
    bridge.show();
  });
};

// Returns a Promise which resolves to an Array of unlocked TrollBridge objects
module.exports.getUnlocked = () => {
  // Given a key, return a TrollBridge if it's unlocked, otherwise nothing.
  let bridgeFromKey = key => {
    return idbKeyval.get(key).then(() => {
      let id = TrollBridge.idFromIdbKey(key);
      let bridge = bridges[id];
      if (!bridge) {
        log.debug(
          `Unexpected key found for unlocked bridges: id=${id}, key=${key}`
        );
      }
      return bridge;
    });
  };

  // Get all the keys in idb, convert to
  return idbKeyval.keys().then(keys => {
    return Promise.all(keys.map(bridgeFromKey)).then(bridges =>
      // In case we somehow got odd keys, remove empty bridges from array
      bridges.filter(bridge => !!bridge)
    );
  });
};
