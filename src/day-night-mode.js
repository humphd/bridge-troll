'use strict';

const svgMarker = require('./svg-marker');

const SunCalc = require('suncalc');
const log = require('./log');
const EventEmitter = require('events');
module.exports = new EventEmitter();

const tileUrlDay = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
const attributionDay =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>';
const tileUrlNight =
  'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
const attributionNight =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

var currentMode = 'night';

module.exports.init = () => {
  changeMode();
};

var changeMode = () => {
  navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 60000
  });
};

var successHandler = pos => {
  let currentTime = new Date();
  let times = SunCalc.getTimes(
    currentTime,
    pos.coords.latitude,
    pos.coords.longitude
  );
  if (currentTime > times.sunriseEnd) {
    if (currentMode != 'day') {
      currentMode = 'day';
      module.exports.emit('modeChanged');
    }
  }

  if (currentTime > times.sunset) {
    if (currentMode != 'night') {
      currentMode = 'night';
      module.exports.emit('modeChanged');
    }
  }
};

var errorHandler = error => {
  log.error(error);
};

setInterval(changeMode, 5000);

var getMode = () => {
  return currentMode;
};

module.exports.getLocationIcon = () => {
  if (getMode() == 'night') {
    return svgMarker.locationNight;
  } else {
    return svgMarker.locationDay;
  }
};

module.exports.getLockedIcon = () => {
  if (getMode() == 'night') {
    return svgMarker.lockedNight;
  } else {
    return svgMarker.lockedDay;
  }
};

module.exports.getUnlockedIcon = () => {
  if (getMode() == 'night') {
    return svgMarker.unlockedNight;
  } else {
    return svgMarker.unlockedDay;
  }
};

module.exports.getMap = () => {
  if (getMode() == 'night') {
    return {
      URL: tileUrlNight,
      attr: attributionNight
    };
  } else {
    return {
      URL: tileUrlDay,
      attr: attributionDay
    };
  }
};
