'use strict';

const geo = require('./geo');
const map = require('./map');
const DEBUG = true;

document.addEventListener('DOMContentLoaded', () => {
    geo.init(DEBUG);

    // Once we know where we are, show the map centred on that point
    geo.events.once('position', (lat, lng) => {
        // Load a map, centered on our current position
        map.init(lat, lng);
 
        // Listen for updates to the map, and check for bridges to show
        map.events.on('update', bounds => {
            let bridges = geo.findWithin(bounds._northEast, bounds._southWest);
            bridges.forEach(bridge => {
                map.addMarker(bridge.lat, bridge.lng, bridge);
            });
        });

        // Stop showing the startup spinner
        document.querySelector('.loading-spinner').style.display = 'none';
    });

    // Listen for bridges nearby
    geo.events.on('bridges', nearby => {
        let lat = nearby[0].lat;
        let lng = nearby[0].lng;
        let url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=-45`;

        document.querySelector('#map').src = url;
        console.log(nearby);
    });

});
