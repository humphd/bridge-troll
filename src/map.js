'use strict';

const log = require('./log');

const EventEmitter = require('events');
module.exports = new EventEmitter();

const leaflet = require('leaflet');
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>';

let map;

const onMapUpdated = () => {
    let bounds = map.getBounds();
    log.debug('map update event', bounds);
    module.exports.emit('update', bounds);
};

module.exports.init = (lat, lng) => {
    map = leaflet.map('map');

    // http://leafletjs.com/reference-1.3.0.html#map-event
    map.on('viewreset', onMapUpdated);
    map.on('moveend', onMapUpdated);

    let tileUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    leaflet
        .tileLayer(tileUrl, { attribution })
        .addTo(map);

    map.setView([lat, lng], 13);
    log.info(`Map initialized with centre lat=${lat}, lng=${lng}`);
};

module.exports.addMarker = (lat, lng, bridge) => {
    // Don't add a marker for this bridge if we already have one.
    if(bridge.marker) {
        log.debug('map.addMarker - skipping, bridge.marker already exists');
        return;
    }

    bridge.marker = leaflet.marker([lat, lng], {
        title: bridge.name
    }).addTo(map);

    bridge.marker.on('click', () => {
        log.debug('popup.click', bridge.streetViewUrl);
        window.open(bridge.streetViewUrl);
    });

    log.info('Added marker for bridge', bridge);
};
