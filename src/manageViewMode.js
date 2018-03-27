'use strict';

var sunCalc = require('suncalc');
let currentMode = "daylight";

let init = (lat, lng) => {
    updateMode(lat, lng);
}

function getMode() {
    return currentMode;
}

function updateMode(lat, lng) {
    let allTimes = sunCalc.getTimes(new Date(), lat, lng);
    let currentTime = new Date();
    if (currentTime <= allTimes.sunrise || currentTime >= allTimes.sunset) {
        currentMode = "night";
    } else {
        currentMode = "daylight";
    }
}

function getTileSet() {
    var tileSet = "";
    if (currentMode === "daylight") {
        //use day tile set
        tileSet = 'https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}';
    } else {
        //use night tile set
        tileSet = 'https://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}';
    }
    return tileSet;
}
module.exports = {
    init,
    getMode,
    updateMode,
    getTileSet
};