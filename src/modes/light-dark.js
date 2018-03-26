'use strict';

const SunCalc = require('suncalc');

const lightUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
const darkUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';

let times;
let currentTime;

class switchModes {
  constructor(lat, lng) {
    times = SunCalc.getTimes(new Date(), lat, lng);
    currentTime = new Date();
  }

  get currentMode() {
    return currentTime <= times.sunriseEnd ? lightUrl : darkUrl;
  }
}

module.exports = switchModes;
