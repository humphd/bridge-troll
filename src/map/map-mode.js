'use strict';

// This file is responsible for switching the map between day and night modes

// Add automatic switching between day and night 
    // Get current time by finding location

// Switch icons depending on time

// Switching map mode on the fly



export class MapMode {
    constructor() { 
        this.currentMode = 'day';
    }

    switchMode(lat, lng) {
        const sunCalc = require('suncalc');

        let currentTime = new Date();
        let times = sunCalc.getTimes(currentTime, lat, lng);
        if(currentTime <= times.sunrise || currentTime >= times.sunset) {
            this.currentMode = 'night';
        } else {
            this.currentMode = 'day';
        }
    }

    get mode() {
        return this.currentMode;
    }
    
    get tileUrl() {
        let dayTile = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            nightTile = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
        
        return (this.currentMode === 'day') ? dayTile : nightTile;
    }

    get attribution() {
        let dayAttr = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
            nightAttr = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';
        
        return (this.currentMode === 'day') ? dayAttr : nightAttr;
    }
}
