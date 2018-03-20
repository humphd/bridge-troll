const Bridge = require('./bridge');
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

module.exports.byId = id => {
  let bridge = bridges[id];
  if (!bridge) {
    log.error('Unable to get bridge by id', id);
  }
  return bridge;
};
