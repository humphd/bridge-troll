'use strict';

const geo = require('./geo');
const map = require('./map');
const log = require('./log');
const svgMarker = require('./svg-marker');

// Support setting logging level via the query string ?loglevel=warn (or debug, error, info)
let queryString = document.location.search;
let matches = /loglevel=([^&]+)/.exec(queryString);
let logLevel = matches && matches[1];
if (logLevel) {
  log.setLevel(logLevel);
}

// Listen for updates to the map's bounding box (viewable area)
// and check for bridges within it that need to be shown.
map.on('update', bounds => {
  let p1 = bounds._northEast;
  let p2 = bounds._southWest;

  geo.findWithin(p1, p2).forEach(bridge => {
    // Don't add a marker for this bridge if we already have one.
    if (bridge.marker) {
      log.debug('map.addMarker - skipping, bridge.marker already exists');
      return;
    }

    // Click handler for when the user clicks on this bridge marker
    let onClick = () => {
      let url = bridge.streetViewUrl;
      log.debug('marker.click', bridge, url);
      window.open(url);
    };

    // Add a new marker to the map for this bridge
    bridge.marker = map.addMarker(
      bridge.lat,
      bridge.lng,
      bridge.title,
      svgMarker.locked, // TODO: deal with locked vs. unlocked
      onClick
    );
  });
});

// Wait until we know where we are, then show the map centred on that point
geo.once('position', (lat, lng) => {
  // Load a map, centered on our current position
  map.init(lat, lng);

  // Stop showing the startup spinner now that map is drawn
  log.info('Removing loading spinner');
  document.querySelector('.loading-spinner').style.display = 'none';

  // Start listening for regular updates to geo position data
  geo.on('position', (lat, lng) => {
    map.setCurrentLocation(lat, lng);
  });
});

// Continuously listen for bridges nearby
geo.on('bridges', nearby => {
  // TODO: need to do collision detection
  log.info('Bridge(s) detected nearby', nearby);
});

const onReady = () => {
  geo.init();
  log.info('Waiting for initial position to show map...');
};

// Wait for the DOM to be loaded before we start anything with the map UI
document.addEventListener('DOMContentLoaded', onReady);
