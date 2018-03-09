'use strict';

const geo = require('./geo');

document.addEventListener('DOMContentLoaded', () => {
    geo.init();

    // Listen for bridges nearby
    geo.events.on('bridges', nearby => {
        console.log(nearby);
    });
});
