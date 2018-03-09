'use strict';

// Expose `bridge` events when we pass nearby known bridge(s)
const EventEmitter = require('events');
const emitter = new EventEmitter();
module.exports.events = emitter;

const Bridge = require('./bridge');
// API docs at https://github.com/salsita/geo-tree
const GeoTree = require('geo-tree');
const set = new GeoTree();
const bridges = {};

let debug = false;

/**
 * Setup the geo data set
 */
module.exports.init = (enableDebug) => {
    debug = enableDebug;

    // Process our raw bridge data into an in-memory db and geo quadtree
    require('./bridges').forEach(record => {
        let bridge = Bridge.fromObject(record);
    
        // Deal with invalid data in the dataset (not all bridges have lat/lng)
        if(!(bridge.id && bridge.lat && bridge.lng)) {
            console.warn(`Skipping bridge: '${bridge.name}', missing data`);
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
    });
};

/**
 * Find all bridges within a bounding box.  p1 and p2 should be diagonal
 * opposite points, defining the box:
 * https://github.com/salsita/geo-tree#find
 */
module.exports.findWithin = (p1, p2) => {
    return set.find(p1, p2).map(id => bridges[id]);
};

/**
 * Given a position (`lat`, `lng`), find all bridges within a radius
 * of `radius` metres, or 1 KM if not specified.
 */
const ONE_KM = 1000;

const find = (lat, lng, radius) => {
    radius = isFinite(radius) ? radius : ONE_KM;
    return set.find({lat, lng}, radius, 'm');
};

const random = () => {
    let ids = Object.keys(bridges);
    let i = Math.floor(Math.random() * ids.length) + 1;
    return bridges[ids[i]];
};

/**
 * Browser Geolocation API - watch for updates to position
 */
if ('geolocation' in navigator) {
    let success = position => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        emitter.emit('position', lat, lng);

        console.info('Checking position', lat, lng);

        let nearby = find(lat, lng);

        if(nearby.length) {
            emitter.emit('bridges', nearby);
        } else if(debug) {
            // Just for testing, get a random bridge
            nearby = [random()];
            emitter.emit('bridges', nearby);
        }
    };

    let error = err => {
        console.error('Error obtaining position info', err);
    };

    navigator.geolocation.watchPosition(success, error);
}
