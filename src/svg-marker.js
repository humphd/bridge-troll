'use strict';

// Using Material Icons as inline SVG - https://material.io/icons/

const leaflet = require('leaflet');
const manageViewMode = require('./manageViewMode');

// Read contents of SVG files from bundle as Data URLs
const locationSvgUrl = require('../icons/material-icons/location.svg');
const lockedSvgUrl = require('../icons/material-icons/locked.svg');
const unlockedSvgUrl = require('../icons/material-icons/unlocked.svg');

const locationSvgUrlWhite = require('../icons/material-icons/locationWhite.svg');
const lockedSvgUrlWhite = require('../icons/material-icons/lockedWhite.svg');
const unlockedSvgUrlWhite = require('../icons/material-icons/unlockedWhite.svg');
// All icons share the same size, define it once
const iconSize = [25, 25];

manageViewMode.updateMode();

// Expose custom Leaflet Icons to be used in our markers
module.exports.location = leaflet.icon({
  iconUrl: (manageViewMode.getMode() == "night" ? locationSvgUrlWhite : locationSvgUrl),
  iconSize
});

module.exports.locked = leaflet.icon({
  iconUrl: (manageViewMode.getMode() == "night" ? lockedSvgUrlWhite : lockedSvgUrl),
  iconSize
});

module.exports.unlocked = leaflet.icon({
  iconUrl: (manageViewMode.getMode() == "night" ? unlockedSvgUrlWhite : unlockedSvgUrl),
  iconSize
});
