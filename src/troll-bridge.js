'use strict';

const Bridge = require('./bridge');
const log = require('./log');
const map = require('./map');
const dayNightMode = require('./day-night-mode');
const db = require('./db');

/**
 * A decorated Bridge type, with extra behaviour for interacting on the map.
 */
class TrollBridge extends Bridge {
  // Namespace a key for use in idb
  get idbKey() {
    return `bridge::${this.id}`;
  }

  // Turn an IDB Key back into an ID
  static idFromIdbKey(key) {
    return key.replace(/bridge::/, '');
  }

  get streetViewUrl() {
    let lat = this.lat;
    let lng = this.lng;

    // https://developers.google.com/maps/documentation/urls/guide
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=-45`;
  }

  get cardUrl() {
    // The unique card image URL for this bridge
    return `../data/cards/${this.id}.svg`;
  }

  get cardImgEl() {
    let img = document.createElement('img');
    img.src = this.cardUrl;
    return img;
  }

  // Show the appropriate icon for this bridge: locked or unlocked, depending
  // on whether or not the user has collected this bridge in the past.
  show(callback) {
    let bridge = this;
    callback = callback || function() {};

    // Don't add a marker for this bridge if we already have one, but update it if display mode was changed
    if (bridge.marker) {
      bridge.isUnlocked((err, unlocked) => {
        bridge.marker.setIcon(
          unlocked
            ? dayNightMode.getUnlockedIcon()
            : dayNightMode.getLockedIcon()
        );
      });
      log.debug('Skipping adding bridge marker, already exists');
      return;
    }

    let addMarker = icon => {
      bridge.marker = map.addMarker(
        bridge.lat,
        bridge.lng,
        bridge.title,
        icon,
        bridge.cardUrl,
        bridge.streetViewUrl
      );

      log.debug('Added bridge to map', bridge);
    };

    // See if the user has already collected this bridge (check idb)
    // before and use locked or unlocked icon depending on the answer.
    bridge.isUnlocked((err, unlocked) => {
      if (err) {
        // Default to locked so we at least show something
        addMarker(dayNightMode.getLockedIcon());
        return callback(err);
      }

      addMarker(
        unlocked ? dayNightMode.getUnlockedIcon() : dayNightMode.getLockedIcon()
      );
      callback(null);
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
    db
      .set(bridge.idbKey, new Date())
      .then(() => {
        bridge.marker.setIcon(dayNightMode.getUnlockedIcon());
        log.info('Unlocked bridge', bridge);
        callback(null);
      })
      .catch(err => {
        log.error(`Unable to set key '${bridge.idbkey}' in idb: ${err}`);
        callback(err);
      });
  }

  isUnlocked(callback) {
    let bridge = this;
    db
      .get(bridge.idbKey)
      .then(val => callback(null, !!val))
      .catch(err => {
        log.error(`Unable to read key '${bridge.idbkey}' from idb: ${err}`);
        callback(err);
      });
  }

  // Create new Bridge from existing JS Object (e.g., parsed JSON)
  static fromObject(obj) {
    return new TrollBridge(
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

module.exports = TrollBridge;
