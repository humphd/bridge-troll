'use strict';

const log = require('./log');
const map = require('./map');

// For debugging, use Seneca@York
const senecaAtYork = {
  lat: 43.7713,
  lng: -79.4989
};

log.info(
  'Override Geolocation. Use `window.fakeGeo` in console or double-click map to move'
);

const callbacks = [];

// Replace native geolocation methods with our own, caching original
navigator.geolocation.watchPosition = (success, error) => {
  let watchId = callbacks.length;
  callbacks.push({ success, error });

  if (callbacks.length === 1) {
    // Trigger an initial position update
    log.info('Using Seneca@York as initial geographic position in debug mode');
    window.fakeGeo.moveTo(senecaAtYork.lat, senecaAtYork.lng);
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
