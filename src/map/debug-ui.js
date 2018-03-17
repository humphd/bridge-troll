'use strict';

const log = require('../log');
const BaseUI = require('./base-ui');
const distance = require('../distance');

const leaflet = require('leaflet');

/**
 * For debugging, we show more info, and allow interactions
 */
class DebugUI extends BaseUI {
  constructor(lat, lng) {
    // use map defaults, but override double-click to zoom
    super(lat, lng, { doubleClickZoom: false });

    // Expose double-click for geolocation faking
    this.map.on('dblclick', e => this.emit('dblclick', e));

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

  /**
   * Adds and returns a marker to the map.
   */
  addMarker(lat, lng, title, icon, onClick) {
    // Show lat/lng info in debug mode.
    title = title + ` (${lat}, ${lng})`;

    // Override onClick to show debug info
    onClick = e => {
      let lat = e.latlng.lat;
      let lng = e.latlng.lng;
      log.debug(`Position = ${lat}, ${lng}`);
    };

    return super.addMarker(lat, lng, title, icon, onClick);
  }
}

module.exports = DebugUI;
