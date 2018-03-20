'use strict';

const log = require('./log');
const map = require('./map');
const config = require('./config');

log.info(
  'Override Geolocation. Use `window.fakeGeo` in console or double-click map to move'
);

const setStartupPosition = () => {
  // If ?lat=...&lng=... is set on query string, use that
  if (config.lat && config.lng) {
    log.debug(`Using initial position lat=${config.lat}, lng=${config.lng}`);
    window.fakeGeo.moveTo(config.lat, config.lng);
  } else {
    // Otherwise use Seneca@York as default
    log.debug(
      'Using Seneca@York for initial position. Use ?lat=...&lng=... to override'
    );
    window.fakeGeo.moveTo(43.7713, -79.4989);
  }
};

const callbacks = [];

// Replace native geolocation methods with our own, caching original
navigator.geolocation.watchPosition = (success, error) => {
  let watchId = callbacks.length;
  callbacks.push({ success, error });

  // If this is the first callback added, fire an initial position update
  if (callbacks.length === 1) {
    setStartupPosition();
  }

  return watchId;
};

navigator.geolocation.clearWatch = id => {
  callbacks.splice(id, 1);
};

const updateCallers = (type, arg) => {
  callbacks.forEach(watch => {
    let fn = watch[type];
    if (typeof fn === 'function') {
      fn(arg);
    }
  });
};

// Provide an API devs can call from unit tests or the console
window.fakeGeo = {
  getCurrentLocation: () => map.getCurrentLocation(),
  moveTo: (lat, lng) =>
    updateCallers('success', { coords: { latitude: lat, longitude: lng } }),
  simulateError: err => updateCallers('error', err)
};

// If the user double-clicks on the map, jump to that position
map.on('dblclick', e => {
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;
  window.fakeGeo.moveTo(lat, lng);
});
