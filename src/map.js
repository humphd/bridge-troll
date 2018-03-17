'use strict';

require('../node_modules/leaflet/dist/leaflet.css');
const log = require('./log');

const EventEmitter = require('events');
const SunCalc = require('suncalc');
var moment = require('moment');
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


  //getting the sunCalc object
  var times = SunCalc.getTimes(new Date(), lat, lng);
  var date = new Date();

  var sunriseTime = (times.sunrise.getHours() * 10 ) + times.sunrise.getMinutes();
  var sunsetTime = (times.sunset.getHours() * 10 ) + times.sunset.getMinutes();
  var currentTime = (date.getHours() * 10) + date.getHours();
  //var currentTime = 225;

  log.info(`SunRise Time=${sunriseTime}`);
  log.info(`SunSet Time=${sunsetTime}`);
  log.info(`Current Time=${currentTime}`);

  var locationMarker;
  if((currentTime - sunsetTime) <  0 && (currentTime - sunriseTime)  > 0 ){
    //if day
    locationMarker = svgMarker.locationDay;
    var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	    maxZoom: 18,
	    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  }else{
    //if night
    //takes longer with the white version of it
    locationMarker = svgMarker.locationNight;
    var CartoDB_DarkMatter = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);
  }

  map.setView([lat, lng], zoomLevel);

  // Show a marker at our current location
  currentLocationMarker = leaflet
    .marker([lat, lng], {
      title: 'Current Location',
      //need to change it so that it switches collour
      icon: locationMarker
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
  map.setView([lat, lng], zoomLevel);
  log.debug(`Moved current location marker to lat=${lat}, lng=${lng}`);
};
