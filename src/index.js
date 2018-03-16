'use strict';

require('../styles/styles.css');

const log = require('./log');
const geo = require('./geo');
const map = require('./map');
const svgMarker = require('./svg-marker');

const Bridge = require('./bridge');
const bridges = {};

// Listen for updates to the map's bounding box (viewable area)
// and check for bridges within it that need to be shown.
map.on('update', bounds => {
  let p1 = bounds._northEast;
  let p2 = bounds._southWest;

  geo.findWithin(p1, p2).forEach(id => {
    let bridge = bridges[id];
    log.debug('Found bridge within map bounds', bridge);

    // Don't add a marker for this bridge if we already have one.
    if (bridge.marker) {
      log.debug('Skipping adding bridge.marker, already exists');
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
      svgMarker.locked,
      onClick
    );
  });
});

// Wait until we know where we are, then show the map centred on that point
geo.once('update', (lat, lng) => {
  log.info('Got initial geolocation info, starting map UI');

  // Load a map, centered on our current position
  map.init(lat, lng);

  // Stop showing the startup spinner now that map is drawn
  log.info('Removing loading spinner');
  document.querySelector('.loading-spinner').style.display = 'none';

  // Start listening for regular updates to geo position data
  geo.on('update', (lat, lng) => {
    map.setCurrentLocation(lat, lng);

    // Look 50m nearby for any bridges to collect
    geo.findNearby(lat, lng, 50).forEach(id => {
      let bridge = bridges[id];
      log.debug('Found nearby bridge', bridge);

      // TODO: need to persist this between sessions.
      // For now just unlock the icon.  Also would be nice
      // to have some kind of animation or other UI indication.
      if (bridge.marker) {
        log.info('Unlocking bridge', bridge);
        bridge.marker.setIcon(svgMarker.unlocked);
      }
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

  document.querySelector('.sk-folding-cube').style.display = 'none';
  document.querySelector('.loading-info').innerHTML = msg;
});

// Request our current position right away
geo.init();

const onReady = () => {
  // Process our raw bridge data into an in-memory db and geo quadtree
  require('./bridges').forEach(record => {
    let bridge = Bridge.fromObject(record);

    // Deal with invalid data in the dataset (not all bridges have lat/lng)
    if (!(bridge.id && bridge.lat && bridge.lng)) {
      log.warn(
        `Bridge missing data, skipping: id=${bridge.id}, lat=${
          bridge.lat
        }, lng=${bridge.lng}`
      );
      return;
    }

    // Record this bridge object in our database
    bridges[bridge.id] = bridge;

    // Also add it to our geo set with id as key
    geo.insert({
      lat: bridge.lat,
      lng: bridge.lng,
      data: bridge.id
    });

    log.debug('Added Bridge', bridge);
  });
};

// Wait for the DOM to be loaded before we start anything with the map UI
document.addEventListener('DOMContentLoaded', onReady);
