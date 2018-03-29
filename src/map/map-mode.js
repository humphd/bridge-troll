'use strict';

// This file is responsible for switching the map between day and night modes

// Add automatic switching between day and night 
    // Get current time by finding location

// Switch icons depending on time

// Switching map mode on the fly



export class MapMode {
    get tileUrl() {
        return 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    }

    get attribution() {
        return '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>';
    }
}
