'use strict';

// Using Material Icons as inline SVG - https://material.io/icons/

const leaflet = require('leaflet');

// Read contents of SVG files from bundle as Data URLs
const locationDaySvgUrl = require('../icons/material-icons/location_day.svg');
const lockedDaySvgUrl = require('../icons/material-icons/locked_day.svg');
const unlockedDaySvgUrl = require('../icons/material-icons/unlocked_day.svg');
const locationNightSvgUrl = require('../icons/material-icons/location_night.svg');
const lockedNightSvgUrl = require('../icons/material-icons/locked_night.svg');
const unlockedNightSvgUrl = require('../icons/material-icons/unlocked_night.svg');

// All icons share the same size, define it once
const iconSize = [25, 25];
// Expose custom Leaflet Icons to be used in our markers
module.exports.locationDay = leaflet.icon({
  iconUrl: locationDaySvgUrl,
  iconSize
});

module.exports.locationNight = leaflet.icon({
  iconUrl: locationNightSvgUrl,
  iconSize
});

module.exports.lockedDay = leaflet.icon({
  iconUrl: lockedDaySvgUrl,
  iconSize
});

module.exports.lockedNight = leaflet.icon({
  iconUrl: lockedNightSvgUrl,
  iconSize
});

module.exports.unlockedDay = leaflet.icon({
  iconUrl: unlockedDaySvgUrl,
  iconSize
});

module.exports.unlockedNight = leaflet.icon({
  iconUrl: unlockedNightSvgUrl,
  iconSize
});

module.exports.unlockedNight = leaflet.icon({
  iconUrl: unlockedNightSvgUrl,
  iconSize
});