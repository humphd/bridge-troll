const SunCalc = require('suncalc');
const svgMarker = require('./svg-marker');


exports.getLocation = function (lat, lng) {
    let times = SunCalc.getTimes(new Date(), lat, lng);
    let currentTime = new Date();

    let sunset = calculateTime(times.sunset.getHours(), times.sunset.getMinutes());
    let sunrise = calculateTime(times.sunrise.getHours(), times.sunrise.getMinutes());
    let current = calculateTime(currentTime.getHours(), currentTime.getMinutes());

    if ((current - sunset) < 0 && (current - sunrise) > 0) {
        //if day
        return svgMarker.locationDay;
    } else {
        //if night
        return svgMarker.locationNight;
    }
};

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
        return CartoDB_DarkMatter = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: 19
        });
    }
};

function getSunTime(lat, lng) {
    return SunCalc.getTimes(new Date(), lat, lng);
}

function calculateTime(hour, min) {
    return (hour * 10) + min;
}

