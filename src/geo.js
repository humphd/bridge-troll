'use strict';

const EventEmitter = require('events');
const emitter = new EventEmitter();
module.exports.events = emitter;

const GeoTree = require('geo-tree');
const set = new GeoTree();

/**
 * Setup the geo data set
 */
module.exports.init = () => {
    set.insert(require('./bridges').map(bridge => {
        return {
            lat: bridge.lat,
            lng: bridge.lng,
            data: bridge.id
        };
    }));    
};

/**
 * Given a position (`lat`, `lng`), find all bridges within a radius
 * of `radius` metres, or 1 KM if not specified.
 */
const ONE_KM = 1000;

const find = module.exports.find = (lat, lng, radius) => {
    radius = isFinite(radius) ? radius : ONE_KM;
    return set.find({lat, lng}, radius, 'm');
};

/**
 * Browser Geolocation API - watch for updates to position
 */
if ('geolocation' in navigator) {
    let success = position => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        console.info('Checking position', lat, lng);

        let nearby = find(lat, lng);
        if(nearby.length) {
            emitter.emit('bridges', nearby);
        }
    };

    let error = err => {
        console.error('Error obtaining position info', err);
    };

    navigator.geolocation.watchPosition(success, error);
}
