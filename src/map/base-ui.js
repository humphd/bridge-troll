'use strict';

const log = require('../log');
const dayNightMode = require('../day-night-mode');

const leaflet = require('leaflet');
const EventEmitter = require('events').EventEmitter;

// TODO: I'm not sure what the ideal zoom level is.  Leaflet often uses 13
// in docs and tutorials.  14 seems to provide a bit more context
// We need something that makes sense for the scale of bridges
// and a person/car/vehicle moving between them.
const defaultZoomLevel = 16;

class BaseUI extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
  }

  init(lat, lng) {
    let mapEl = document.createElement('div');
    mapEl.id = 'map';
    document.body.appendChild(mapEl);

    // http://leafletjs.com/reference-1.3.0.html#map
    let map = (this.map = leaflet.map(mapEl, this.options));
    let tile = dayNightMode.getMap();
    let attribution = tile.attr;
    this.tileLayer = leaflet.tileLayer(tile.URL, { attribution }).addTo(map);
    map.setView([lat, lng], defaultZoomLevel);

    // http://leafletjs.com/reference-1.3.0.html#map-event
    let onMapChange = () => this.emit('update', map.getBounds());
    map.on('viewreset', onMapChange);
    map.on('moveend', onMapChange);

    // Show a marker at our current location
    this.currentLocationMarker = leaflet
      .marker([lat, lng], {
        title: 'Current Location',
        icon: dayNightMode.getLocationIcon()
      })
      .addTo(map);

    log.info(`Map initialized with centre lat=${lat}, lng=${lng}`);
  }

  get zoomLevel() {
    return defaultZoomLevel;
  }

  /**
   * Add a marker to the map
   * @param {*} lat
   * @param {*} lng
   * @param {*} title tooltip to show
   * @param {*} icon icon to use
   * @param {*} onClick optional onClick handler
   */
  addMarker(lat, lng, title, icon, cardUrl, streetViewUrl) {
    let marker = leaflet
      .marker([lat, lng], {
        title,
        icon
      })
      .bindPopup(`<img src="${cardUrl}">`)
      .addTo(this.map);

    // Wire-up a click handlers for this marker
    marker.on('click', () => marker.openPopup());
    marker.on('dblclick', () => window.open(streetViewUrl));

    log.debug(`Added marker title=${title} at lat=${lat}, lng=${lng}`);
    return marker;
  }

  /**
   * Centre of the map and update location marker
   */
  setCurrentLocation(lat, lng) {
    this.currentLocationMarker.setLatLng({ lat, lng });
    this.map.setView([lat, lng], this.zoomLevel);
    log.debug(`Moved current location marker to lat=${lat}, lng=${lng}`);
  }

  updateMap() {
    let tile = dayNightMode.getMap();
    this.tileLayer.setUrl(tile.URL);
    this.tileLayer.attribution = tile.attribution;
  }

  updateLocationIcon() {
    this.currentLocationMarker.setIcon(dayNightMode.getLocationIcon());
  }

  getCurrentLocation() {
    return this.map.getCenter();
  }

  redraw() {
    this.map.invalidateSize();
  }
}

module.exports = BaseUI;
