'use strict';

const log = require('./log');
const map = require('./map');

log.info(
  'Override Geolocation. Use `window.fakeGeo` in console or double-click map to move'
);

const callbacks = [];

// Replace native geolocation methods with our own, caching original
navigator.geolocation.watchPosition = (success, error) => {
  let watchId = callbacks.length;
  callbacks.push({ success, error });
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

// Get the current position so we can report it on startup
navigator.geolocation.getCurrentPosition(pos => {
  updateCallers('success', pos);
});

// If the user double-clicks on the map, jump to that position
map.on('dblclick', e => {
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;
  window.fakeGeo.moveTo(lat, lng);
});
