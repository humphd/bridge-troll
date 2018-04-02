'use strict';

const chai = require('chai');
const assert = chai.assert;

require('../src/fake-geolocation');

describe('fake-geolocation module', () => {
  describe('window.fakeGeo API', () => {
    const finished = (done, watchId) => {
      navigator.geolocation.clearWatch(watchId);
      done();
    };

    it('should add window.fakeGeo object', () => {
      assert.exists(window.fakeGeo);
      assert.isFunction(window.fakeGeo.moveTo);
      assert.isFunction(window.fakeGeo.simulateError);
    });

    it('window.fakeGeo.moveTo() should trigger watchPosition success()', done => {
      const lat = 43.7963033;
      const lng = -79.3477667;

      const success = pos => {
        assert.exists(pos.coords);
        assert.equal(pos.coords.latitude, lat);
        assert.equal(pos.coords.longitude, lng);
        finished(done, watchId);
      };

      const error = err => {
        // Should not happen
        assert.fail(err);
        finished(done, watchId);
      };

      const watchId = navigator.geolocation.watchPosition(success, error);
      window.fakeGeo.moveTo(lat, lng);
    });

    it('window.fakeGeo.simulateError() should trigger watchPosition error()', done => {
      let success = () => {
        // Should not happen
        assert.fail();
        finished(done, watchId);
      };

      let error = err => {
        assert.exists(err);
        finished(done, watchId);
      };

      const watchId = navigator.geolocation.watchPosition(success, error);
      window.fakeGeo.simulateError(new Error('Simulated Error'));
    });
  });
});
