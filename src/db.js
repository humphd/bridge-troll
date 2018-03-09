'use strict';

const geo = require('./geo');
const Bridge = require('./bridge');
// Simple in-memory data store of all Bridge items, keyed on bridge id.
const db = {};

require('./bridges').forEach(record => {
    let bridge = Bridge.fromObject(record);

    // Deal with invalid data in the dataset (not all bridges have lat/lng)
    if(!(bridge.id && bridge.lat && bridge.lng)) {
        console.warn(`Skipping bridge: '${bridge.name}', missing data`);
        return;
    }

    // Record this bridge object in our database
    db[bridge.id] = bridge;
});

/**
 * Return all bridge objects that are within the given radius of (lat, lng)
 */
module.exports.lookup = (lat, lng, radius) => {
    return geo.find(lat, lng, radius).map(id => db[id]);
};
