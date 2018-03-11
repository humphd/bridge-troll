'use strict';

const geo = require('./geo');
const map = require('./map');
const log = require('./log');

// Support setting logging level via the query string ?loglevel=warn (or debug, error, info)
let queryString = document.location.search;
let matches = /loglevel=([^&]+)/.exec(queryString);
let logLevel = matches && matches[1];
if(logLevel) {
    log.setLevel(logLevel);
}

const findNearbyBridges = (p1, p2) => {
    let bridges = geo.findWithin(p1, p2);
    bridges.forEach(bridge => {
        map.addMarker(bridge.lat, bridge.lng, bridge);
    });
};

// Wait for the DOM to be loaded before we start anything with the map UI
document.addEventListener('DOMContentLoaded', () => {
    geo.init();

    // Once we know where we are, show the map centred on that point
    geo.once('position', (lat, lng) => {
        // Listen for updates to the map, and check for bridges to show
        map.on('update', bounds => {
            findNearbyBridges(bounds._northEast, bounds._southWest);
        });

        // Load a map, centered on our current position
        map.init(lat, lng);

        // Stop showing the startup spinner
        log.info('Removing loading spinner');
        document.querySelector('.loading-spinner').style.display = 'none';
    });

    // Listen for bridges nearby
    geo.on('bridges', nearby => {
        log.info('Bridge(s) detected nearby', nearby);
    });

    log.info('Waiting for initial position to show map...');
});
