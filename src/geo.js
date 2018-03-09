'use strict';

const GeoTree = require('geo-tree');
const set = new GeoTree();
set.insert(require('./bridges').map(bridge => {
    return {
        lat: bridge.lat,
        lng: bridge.lng,
        data: bridge.id
    };
}));

/**
 * Given a position (`lat`, `lng`), find all bridges within a radius
 * of `radius` metres, or 1 KM if not specified.
 */
const ONE_KM = 1000;

module.exports.find = (lat, lng, radius) => {
    radius = isFinite(radius) ? radius : ONE_KM;
    return set.find({lat, lng}, radius, 'm');
};

