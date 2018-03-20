'use strict';

require('../styles/styles.css');

const log = require('./log');
const geo = require('./geo');
const map = require('./map');
const distance = require('./distance');
const bridges = require('./bridges');

// Listen for updates to the map's bounding box (viewable area)
// and check for bridges within it that need to be shown.
map.on('update', bounds => {
  let p1 = bounds._northEast;
  let p2 = bounds._southWest;

  geo.findWithin(p1, p2).forEach(id => {
    let bridge = bridges.byId(id);
    log.debug('Found bridge within map bounds', bridge);
    // Add an icon to the map for this bridge
    bridge.show();
  });
});

// Wait until we know where we are, then show the map centred on that point
geo.once('update', (lat, lng) => {
  log.info('Got initial geolocation info, starting map UI');

  // Load a map, centered on our current position
  map.init(lat, lng);

  // Stop showing the startup spinner now that map is drawn
  log.info('Removing loading spinner');
  let loadingSpinner = document.querySelector('.loading-spinner');
  if (loadingSpinner) {
    loadingSpinner.style.display = 'none';
  }

  // Start listening for regular updates to geo position data
  geo.on('update', (lat, lng) => {
    map.setCurrentLocation(lat, lng);

    // Look nearby for any bridges to collect
    geo.findNearby(lat, lng, distance.COLLISION_M).forEach(id => {
      let bridge = bridges.byId(id);
      log.debug('Found nearby bridge', bridge);
      bridge.unlock();
    });
  });
});

// Deal with any errors that might happen from geolocation update requests
geo.once('error', err => {
  let msg;

  /* permission denied */
  if (err.code === 1) {
    msg = 'Permission denied getting your location.';
  } else if (err.code === 2) {
    /* position unavailable (error response from location provider) */
    msg = 'Location information unavailable at this time.';
  } else if (err.code === 3) {
    /* timed out */
    msg = 'Timeout error getting your location.';
  } else {
    /* unknown error */
    msg = 'Unable to get your location.';
  }

  msg = msg + '<br>Refresh your browser to try again.';

  let foldingCube = document.querySelector('.sk-folding-cube');
  if (foldingCube) {
    foldingCube.style.display = 'none';
  }
  let loadingInfo = document.querySelector('.loading-info');
  if (loadingInfo) {
    loadingInfo.innerHTML = msg;
  }
});

// Request our current position right away
geo.init();

// Wait for the DOM to be loaded before we start anything with the map UI
document.addEventListener('DOMContentLoaded', bridges.init);
