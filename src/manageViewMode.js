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
        currentMode = "night";
    }
}

function getTileSet() {
    var tileSet = "";
    if (currentMode === "daylight") {
        //use day tile set
        tileSet = 'https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}';
    } else {
        //use night tile set        
        //tileSet ='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        tileSet = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
        //tileSet = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
    }
    return tileSet;
}

module.exports = {
    init,
    getMode,
    updateMode,
    getTileSet
};