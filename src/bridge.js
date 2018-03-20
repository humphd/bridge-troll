'use strict';

// See https://github.com/jakearchibald/idb-keyval#usage.
// Also, using .default to work around webpack module loading bug:
// https://github.com/jakearchibald/idb-keyval/issues/25
const idbKeyval = require('idb-keyval').default;

const map = require('./map');
const log = require('./log');
const svgMarker = require('./svg-marker');

// A lot of the bridge names have odd spacing characters
const cleanName = name => {
  return name
    .replace(/\.{2,}/, '') // get rid of ......
    .replace(/\s{2,}/, '') // get rid of multiple spaces
    .replace(/-{2,}/, '') // get rid of ------
    .replace(/\r?\n/, ' '); // get rid of embedded line breaks
};

class Bridge {
  constructor(id, name, lat, lng, year, length, width) {
    this.id = id;
    this.name = cleanName(name);
    this.lat = lat;
    this.lng = lng;
    this.year = year;
    // TODO: perhaps we can use these dimensions when comparing geo position?
    this.length = length;
    this.width = width;
  }

  get streetViewUrl() {
    let lat = this.lat;
    let lng = this.lng;

    // https://developers.google.com/maps/documentation/urls/guide
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=-45`;
  }

  get title() {
    return `${this.name} [${this.year}]`;
  }

  // Namespace a key for use in idb
  get idbKey() {
    return `bridge::${this.id}`;
  }

  // Show the appropriate icon for this bridge: locked or unlocked, depending
  // on whether or not the user has collected this bridge in the past.
  show(callback) {
    let bridge = this;
    callback = callback || function() {};

    // Don't add a marker for this bridge if we already have one.
    if (bridge.marker) {
      log.debug('Skipping adding bridge marker, already exists');
      return;
    }

    let addMarker = icon => {
      // Click handler for when the user clicks on this bridge marker
      let onClick = () => {
        let url = bridge.streetViewUrl;
        log.debug('marker.click', url);
        window.open(url);
      };

      bridge.marker = map.addMarker(
        bridge.lat,
        bridge.lng,
        bridge.title,
        icon,
        onClick
      );

      log.debug('Added bridge to map', bridge);
    };

    // See if the user has already collected this bridge (check idb)
    // before and use locked or unlocked icon depending on the answer.
    idbKeyval
      .get(bridge.idbKey)
      .then(val => {
        if (val) {
          addMarker(svgMarker.unlocked);
        } else {
          addMarker(svgMarker.locked);
        }
        callback(null);
      })
      .catch(err => {
        log.error(`Unable to read key '${bridge.idbkey}' from idb: ${err}`);
        // Default to locked so we at least show something
        addMarker(svgMarker.locked);
        callback(err);
      });
  }

  // The user has collected this bridge, unlock it and persist to idb
  unlock(callback) {
    let bridge = this;
    callback = callback || function() {};

    // The marker should already exist. If it doesn't, that's a bug, bail with an error
    if (!bridge.marker) {
      log.error('Called unlock() on Bridge instance with no marker');
      return;
    }

    // Set key in idb indicating that we've collected this bridge
    idbKeyval
      .set(bridge.idbKey, new Date())
      .then(() => {
        bridge.marker.setIcon(svgMarker.unlocked);
        log.info('Unlocked bridge', bridge);
        callback(null);
      })
      .catch(err => {
        log.error(`Unable to set key '${bridge.idbkey}' in idb: ${err}`);
        callback(err);
      });
  }

  // Create new Bridge from CSV record data
  static fromCsvRecord(record) {
    return new Bridge(
      record['id'],
      record['structure'],
      record['latitude'],
      record['longitude'],
      record['year_built'],
      record['deck_length'],
      record['width']
    );
  }

  // Create new Bridge from existing JS Object (e.g., parsed JSON)
  static fromObject(obj) {
    return new Bridge(
      obj.id,
      obj.name,
      obj.lat,
      obj.lng,
      obj.year,
      obj.length,
      obj.width
    );
  }
}

module.exports = Bridge;
