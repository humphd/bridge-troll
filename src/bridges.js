const Bridge = require('./bridge');
const distance = require('./distance');
const geo = require('./geo');
const log = require('./log');

const bridgeData = require('../data/bridge-data.json');
const bridges = {};

// Process our raw bridge data into an in-memory db and geo quadtree
module.exports.init = () => {
  bridgeData.forEach(record => {
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
