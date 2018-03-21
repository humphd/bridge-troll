'use strict';

const log = require('../log');
const BaseUI = require('./base-ui');
const distance = require('../distance');

const leaflet = require('leaflet');

const clickHandler = e => {
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;
  log.debug(`${lat}, ${lng}`);
};

/**
 * For debugging, we show more info, and allow interactions
 */
class DebugUI extends BaseUI {
  constructor() {
    // use map defaults, but override double-click to zoom
    super({ doubleClickZoom: false });
  }

  // Override init() in order to add extra map debugging info
  init(lat, lng) {
    super.init(lat, lng);

    // Expose click and double-click for geolocation faking
    this.map.on('dblclick', e => this.emit('dblclick', e));
    this.map.on('click', clickHandler);

    // In debug mode, also show a radius beyond current location for collisions
    this.currentLocationDebugRadius = leaflet
      .circle([lat, lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: distance.COLLISION_M
      })
      .addTo(this.map);
  }

  get zoomLevel() {
    // In debug mode, allow retaining the current zoom level.
    return this.map.getZoom();
  }

  setCurrentLocation(lat, lng) {
    super.setCurrentLocation(lat, lng);
    // Update the collision debug radius too
    this.currentLocationDebugRadius.setLatLng({ lat, lng });
  }
}

module.exports = DebugUI;
