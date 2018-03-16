'use strict';

require('../node_modules/leaflet/dist/leaflet.css');
const log = require('./log');
const debug = require('./debug');

const EventEmitter = require('events');
module.exports = new EventEmitter();

const leaflet = require('leaflet');
const attribution =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>';

const svgMarker = require('./svg-marker');

let map;
let currentLocationMarker;

// TODO: I'm not sure what the ideal zoom level is.  Leaflet often uses 13
// in docs and tutorials.  14 seems to provide a bit more context
// We need something that makes sense for the scale of bridges
// and a person/car/vehicle moving between them.
const defaultZoomLevel = 16;

const getZoomLevel = () => {
  // In debug mode, allow retaining the current zoom level.
  if (debug.enabled) {
    return map.getZoom();
  }
  // Otherwise always use the default.
  return defaultZoomLevel;
};

const onMapUpdated = () => {
  let bounds = map.getBounds();
  log.debug('map update event', bounds);
  module.exports.emit('update', bounds);
};

/**
 * Creates the map and positions the location marker
 * @param {*} lat
 * @param {*} lng
 */
module.exports.init = (lat, lng) => {
  // When running in debug mode, allow user interaction with map.
  let mapOptions = debug.enabled
    ? { doubleClickZoom: false } // use map defaults, but override doubleclick to zoom
    : {
        // Disable zoom, pan, and other manual interaction methods.
        zoomControl: false,
        boxZoom: false,
        dragging: false,
        doubleClickZoom: false,
        keyboard: false,
        scrollWheelZoom: false,
        touchZoom: false
      };

  // http://leafletjs.com/reference-1.3.0.html#map
  map = leaflet.map('map', mapOptions);

  // http://leafletjs.com/reference-1.3.0.html#map-event
  map.on('viewreset', onMapUpdated);
  map.on('moveend', onMapUpdated);

  // Enable extra mouse events for map when in debug mode
  if (debug.enabled) {
    map.on('dblclick', e => module.exports.emit('dblclick', e));
  }

  let tileUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
  leaflet.tileLayer(tileUrl, { attribution }).addTo(map);

  map.setView([lat, lng], defaultZoomLevel);

  // Show a marker at our current location
  currentLocationMarker = leaflet
    .marker([lat, lng], {
      title: 'Current Location',
      icon: svgMarker.location
    })
    .addTo(map);

  log.info(`Map initialized with centre lat=${lat}, lng=${lng}`);
};

/**
 * Adds and returns a marker to the map.
 */
module.exports.addMarker = (lat, lng, title, icon, onClick) => {
  let marker = leaflet
    .marker([lat, lng], {
      title,
      icon
    })
    .addTo(map);

  // Wire-up a click handler for this marker
  if (onClick) {
    marker.on('click', onClick);
  }

  log.debug(`Added marker title=${title} at lat=${lat}, lng=${lng}`);

  return marker;
};

/**
 * Re-centre the map and update location marker
 */
module.exports.setCurrentLocation = (lat, lng) => {
  currentLocationMarker.setLatLng({ lat, lng });
  map.setView([lat, lng], getZoomLevel());
  log.debug(`Moved current location marker to lat=${lat}, lng=${lng}`);
};
