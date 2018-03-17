'use strict';

require('../node_modules/leaflet/dist/leaflet.css');
const log = require('./log');

const EventEmitter = require('events');
const SunCalc = require('suncalc');
const dayNight = require('./dayNight');
module.exports = new EventEmitter();

const leaflet = require('leaflet');
const attribution =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>';

const svgMarker = require('./svg-marker');

let map;
let currentLocationMarker;
let currentState;

// TODO: I'm not sure what the ideal zoom level is.  Leaflet often uses 13
// in docs and tutorials.  14 seems to provide a bit more context
// We need something that makes sense for the scale of bridges
// and a person/car/vehicle moving between them.
const zoomLevel = 16;

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
  // http://leafletjs.com/reference-1.3.0.html#map
  map = leaflet.map('map', {
    // Disable zoom, pan, and other manual interaction methods.
    zoomControl: false,
    boxZoom: false,
    dragging: false,
    doubleClickZoom: false,
    keyboard: false,
    scrollWheelZoom: false,
    touchZoom: false
  });

  // http://leafletjs.com/reference-1.3.0.html#map-event
  map.on('viewreset', onMapUpdated);
  map.on('moveend', onMapUpdated);
  map.on('click', e => module.exports.emit('click', e));
  map.on('dblclick', e => module.exports.emit('dblclick', e));

  if(!currentState){
    var locationMarker = dayNight.getLocation(lat, lng);

    dayNight.getMap(lat, lng).addTo(map);

    currentState = dayNight.isDay(lat, lng);
  }else if (currentState === dayNight.isDay(lat, lng)) {
    var locationMarker = dayNight.getLocation(lat, lng);

    dayNight.getMap(lat, lng).addTo(map);

    currentState = dayNight.isDay(lat, lng);
  }
  map.setView([lat, lng], zoomLevel);

  // Show a marker at our current location
  currentLocationMarker = leaflet
    .marker([lat, lng], {
      title: 'Current Location',
      icon: locationMarker
    })
    .addTo(map);

  log.info(`Map initialized with centre lat=${lat}, lng=${lng}`);
};

/**
 * Adds and returns a marker to the map.
 */
module.exports.addMarker = (lat, lng, title, icon, onClick) => {
  //might just need to do currently location
  if (title === 'Current Location') {
    //need to see if day change happened
    if (currentState !== dayNight.isDay(lat, lng)) {
      icon = dayNight.getLocation(lat, lng);

      dayNight.getMap(lat, lng).addTo(map);

      currentState = dayNight.isDay(lat, lng);
    }
  }

  let marker = leaflet
    .marker([lat, lng], {
      title,
      icon
      //need to try again
      //icon:locationMarker
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
  //can do the updates here
  currentLocationMarker.setLatLng({ lat, lng });
  map.setView([lat, lng], zoomLevel);
  log.debug(`Moved current location marker to lat=${lat}, lng=${lng}`);
};
