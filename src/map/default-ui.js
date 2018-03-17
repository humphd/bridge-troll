'use strict';

const BaseUI = require('./base-ui');

/**
 * By default, we disable a bunch of interaction methods on the map
 */
class DefaultUI extends BaseUI {
  constructor() {
    // Disable zoom, pan, and other manual interaction methods.
    super({
      zoomControl: false,
      boxZoom: false,
      dragging: false,
      doubleClickZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      touchZoom: false
    });
  }
}

module.exports = DefaultUI;
