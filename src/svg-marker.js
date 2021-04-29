'use strict';

// Using Material Icons as inline SVG - https://material.io/icons/

const leaflet = require('leaflet');

// Read contents of SVG files from bundle as Data URLs

//Day mode
const locationSvgUrlDay = require('../icons/material-icons/location.svg');
const lockedSvgUrlDay = require('../icons/material-icons/locked.svg');
const unlockedSvgUrlDay = require('../icons/material-icons/unlocked.svg');

//Night mode
const locationSvgUrlNight = require('../icons/material-icons/location_w.svg');
const lockedSvgUrlNight = require('../icons/material-icons/locked_w.svg');
const unlockedSvgUrlNight = require('../icons/material-icons/unlocked_w.svg');

// All icons share the same size, define it once
const iconSize = [25, 25];

// Expose custom Leaflet Icons to be used in our markers
module.exports.locationDay = leaflet.icon({
  iconUrl: locationSvgUrlDay,
  iconSize
});

module.exports.lockedDay = leaflet.icon({
  iconUrl: lockedSvgUrlDay,
  iconSize
});

module.exports.unlockedDay = leaflet.icon({
  iconUrl: unlockedSvgUrlDay,
  iconSize
});

module.exports.locationNight = leaflet.icon({
  iconUrl: locationSvgUrlNight,
  iconSize
});

module.exports.lockedNight = leaflet.icon({
  iconUrl: lockedSvgUrlNight,
  iconSize
});

module.exports.unlockedNight = leaflet.icon({
  iconUrl: unlockedSvgUrlNight,
  iconSize
});
