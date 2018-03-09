'use strict';

const EventEmitter = require('events');
const emitter = new EventEmitter();
module.exports.events = emitter;

const leaflet = require('leaflet');
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>';

let map;

const onMapUpdated = () => {
    emitter.emit('update', map.getBounds());
};

module.exports.init = (lat, lng) => {
    map = leaflet.map('map').setView([lat, lng], 13);

    let tileUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    leaflet
        .tileLayer(tileUrl, { attribution })
        .addTo(map);

    // http://leafletjs.com/reference-1.3.0.html#map-event
    map.on('viewreset', onMapUpdated);
    map.on('moveend', onMapUpdated);
};

module.exports.addMarker = (lat, lng, bridge) => {
    // Don't add a popup for this bridge if we already have one.
    if(bridge.popup) {
        return;
    }
    
    bridge.popup = leaflet.marker([lat, lng], {
        title: bridge.name
    }).addTo(map);

    bridge.popup.on('click', () => {
        window.open(bridge.streetViewUrl);
    });
};
