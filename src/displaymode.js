let currentMode = null;

/**
 *  Returns the current UI mode
 * 
 * @returns  currentMode
 */
let getMode = function(){
  return currentMode;
}

/**
 * Sets the theme of the UI
 * 
 * @param {string} mode 
 */
let setMode = function(mode){
  if (mode === 'dark'){
    currentMode = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
  }else if (mode === 'light'){
    currentMode = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
  }
};

module.exports = {
  getMode,
  setMode
};
