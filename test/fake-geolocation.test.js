'use strict';

const chai = require('chai');
const assert = chai.assert;

require('../src/fake-geolocation');

describe('fake-geolocation module', () => {
  describe('window.fakeGeo API', () => {
    it('should add window.fakeGeo object', () => {
      assert.exists(window.fakeGeo);
      assert.isFunction(window.fakeGeo.moveTo);
      assert.isFunction(window.fakeGeo.simulateError);
    });

    it('window.fakeGeo.moveTo() should trigger watchPosition success()', done => {
      let lat = 43.7963033;
      let lng = -79.3477667;

      let success = pos => {
        assert.exists(pos.coords);
        assert.equal(pos.coords.latitude, lat);
        assert.equal(pos.coords.longitude, lng);
        done();
      };

      let error = err => {
        // Should not happen
        assert.fail(err);
        done();
      };

      navigator.geolocation.watchPosition(success, error);
      window.fakeGeo.moveTo(lat, lng);
    });

    it('window.fakeGeo.simulateError() should trigger watchPosition error()', done => {
      let success = () => {
        // Should not happen
        assert.fail();
        done();
      };

      let error = err => {
        assert.exists(err);
        done();
      };

      navigator.geolocation.watchPosition(success, error);
      window.fakeGeo.simulateError(new Error('Simulated Error'));
    });
  });
});

/**
TODO

// Replace native geolocation methods with our own, caching original
navigator.geolocation.watchPosition = (success, error) => {
  let watchId = callbacks.length;
  callbacks.push({ success, error });
  return watchId;
};

navigator.geolocation.clearWatch = id => {
  callbacks.splice(id, 1);
};

// If the user double-clicks on the map, jump to that position
map.on('dblclick', e => {
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;
  window.fakeGeo.moveTo(lat, lng);
});

// need to clearWatch between tests...

 */
