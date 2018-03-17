const SunCalc = require('suncalc');
const svgMarker = require('./svg-marker');
const log = require('./log');

/**
 * This returns a location icon depending on the time of day
 * @param {*} lat The Latitude
 * @param {*} lng The Longitude
 */
exports.getLocation = function (lat, lng) {
    let times = SunCalc.getTimes(new Date(), lat, lng);
    let currentTime = new Date();

    let sunset = calculateTime(times.sunset.getHours(), times.sunset.getMinutes());
    let sunrise = calculateTime(times.sunrise.getHours(), times.sunrise.getMinutes());
    let current = calculateTime(currentTime.getHours(), currentTime.getMinutes());

    log.info(`sunset=${sunset}`);
    log.info(`sunrise=${sunrise}`);
    log.info(`current=${current}`);

    if ((current - sunset) < 0 && (current - sunrise) > 0) {
        //if day
        return svgMarker.locationDay;
    } else {
        //if night
        return svgMarker.locationNight;
    }
};

/**
 * This returns a unlocked icon depending on the time of day
 * @param {*} lat The Latitude
 * @param {*} lng The Longitude
 */
exports.getUnlocked = function (lat, lng) {
    let times = SunCalc.getTimes(new Date(), lat, lng);
    let currentTime = new Date();

    let sunset = calculateTime(times.sunset.getHours(), times.sunset.getMinutes());
    let sunrise = calculateTime(times.sunrise.getHours(), times.sunrise.getMinutes());
    let current = calculateTime(currentTime.getHours(), currentTime.getMinutes());

    log.info(`sunset=${sunset}`);
    log.info(`sunrise=${sunrise}`);
    log.info(`current=${current}`);

    if ((current - sunset) < 0 && (current - sunrise) > 0) {
        //if day
        return svgMarker.unlockedDay;
    } else {
        //if night
        return svgMarker.unlockedNight;
    }
};

/**
 * This returns a locked icon depending on the time of day
 * @param {*} lat The Latitude
 * @param {*} lng The Longitude
 */
exports.getLocked = function (lat, lng) {
    let times = SunCalc.getTimes(new Date(), lat, lng);
    let currentTime = new Date();

    let sunset = calculateTime(times.sunset.getHours(), times.sunset.getMinutes());
    let sunrise = calculateTime(times.sunrise.getHours(), times.sunrise.getMinutes());
    let current = calculateTime(currentTime.getHours(), currentTime.getMinutes());

    log.info(`sunset=${sunset}`);
    log.info(`sunrise=${sunrise}`);
    log.info(`current=${current}`);

    if ((current - sunset) < 0 && (current - sunrise) > 0) {
        //if day
        return svgMarker.lockedDay;
    } else {
        //if night
        return svgMarker.lockedNight;
    }
};

/**
 * This returns a map based on the time of day
 * @param {*} lat The Latitude
 * @param {*} lng The Longitude
 */
exports.getMap = function (lat, lng) {
    let times = SunCalc.getTimes(new Date(), lat, lng);
    let currentTime = new Date();

    let sunset = calculateTime(times.sunset.getHours(), times.sunset.getMinutes());
    let sunrise = calculateTime(times.sunrise.getHours(), times.sunrise.getMinutes());
    let current = calculateTime(currentTime.getHours(), currentTime.getMinutes());

    
    if ((current - sunset) < 0 && (current - sunrise) > 0) {
        //if day
        return L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
    } else {
        //if night
        return L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: 19
        });
    }
};

/**
 * This function tells if it's day or night
 * @param {*} lat The Latitude
 * @param {*} lng The Longitude
 */
exports.isDay = function (lat, lng) {
    let times = SunCalc.getTimes(new Date(), lat, lng);
    let currentTime = new Date();

    let sunset = calculateTime(times.sunset.getHours(), times.sunset.getMinutes());
    let sunrise = calculateTime(times.sunrise.getHours(), times.sunrise.getMinutes());
    let current = calculateTime(currentTime.getHours(), currentTime.getMinutes());

    if ((current - sunset) < 0 && (current - sunrise) > 0) {
        //if day
        return true;
    } else {
        //if night
        return false;
    }
};

/**
 * This function returns the time in a number format
 * @param {*} hour The hour has to be in 24 hour time
 * @param {*} min A minute ex. 0 to 59
 */
function calculateTime(hour, min) {
    return (hour * 100) + min;
}

