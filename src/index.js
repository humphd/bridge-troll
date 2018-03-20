'use strict';

require('../styles/styles.css');

const log = require('./log');
const geo = require('./geo');
const map = require('./map');
const bridges = require('./bridges');

// Listen for updates to the map's bounding box (viewable area)
map.on('update', bounds => {
  let p1 = bounds._northEast;
  let p2 = bounds._southWest;

  // Show any bridges within the area defined by p1, p2.
  bridges.showWithin(p1, p2);
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
    // Update the map to show our current location
    map.setCurrentLocation(lat, lng);
    // Any bridges nearby our current point can be unlocked.
    bridges.unlockNearby(lat, lng);
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
