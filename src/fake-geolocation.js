'use strict';

const log = require('./log');
const map = require('./map');
const config = require('./config');

log.info(
  'Override Geolocation. Use `window.fakeGeo` in console or double-click map to move'
);

const setStartupPosition = success => {
  let lat;
  let lng;

  // If ?lat=...&lng=... is set on query string, use that
  if (config.lat && config.lng) {
    log.debug(`Using initial position lat=${config.lat}, lng=${config.lng}`);
    lat = config.lat;
    lng = config.lng;
  } else {
    // Otherwise use Seneca@York as default
    log.debug(
      'Using Seneca@York for initial position. Use ?lat=...&lng=... to override'
    );
    lat = 43.7713;
    lng = -79.4989;
  }

  let position = { coords: { latitude: lat, longitude: lng } };
  success(position);
};

const callbacks = [];

// Replace native geolocation methods with our own, caching original
navigator.geolocation.watchPosition = (success, error) => {
  let watchId = callbacks.length;

  // Cache these callbacks so we can call them later in response to moveTo or simulateError
  callbacks.push({ success, error });

  // Trigger an initial position update, since geo.init() will expect it
  setStartupPosition(success);

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
