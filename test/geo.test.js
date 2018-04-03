'use strict';

const chai = require('chai');
const assert = chai.assert;

const geo = require('../src/geo');

const bridges = [
  { lat: 43.754521, lng: -79.530479, data: 'bridge1' },
  { lat: 43.754449, lng: -79.530818, data: 'bridge2' },
  { lat: 43.776573, lng: -79.53602, data: 'bridge3' },
  { lat: 43.772721, lng: -79.534787, data: 'bridge4' },
  { lat: 43.772661, lng: -79.53514, data: 'bridge5' }
];

describe('geo module', () => {
  // Initialize the geo module before doing any of the tests.
  before(done => {
    geo.once('update', () => {
      bridges.forEach(bridge =>
        geo.insert(bridge.lat, bridge.lng, bridge.data)
      );
      done();
    });
    geo.init();
  });

  it('moving location causes an update event', done => {
    const myLat = 43.75503131655796;
    const myLng = -79.5283341407776;

    geo.once('update', (lat, lng) => {
      assert.equal(lat, myLat, 'lat does not match');
      assert.equal(lng, myLng, 'lng does not match');
      done();
    });

    window.fakeGeo.moveTo(myLat, myLng);
  });

  it('should locate bridges within a given bounding box', () => {
    // A bounding box
    const boundsP1 = { lat: 43.755938, lng: -79.527953 };
    const boundsP2 = { lat: 43.753016, lng: -79.532121 };

    // Locate all bridges contained within the bounding box, should be only the first 2.
    let found = geo.findWithin(boundsP1, boundsP2);
    assert.equal(found.length, 2);
    assert.includeMembers(found, ['bridge1', 'bridge2']);
  });

  it('should locate only bridges within a given radius', () => {
    // A point on the map
    const point = { lat: 43.77280596701259, lng: -79.53441739082338 };

    // Locate all bridges contained within the a radius of 50m from our point
    let nearby = geo.findNearby(point.lat, point.lng, 50);
    assert.equal(nearby.length, 1);
    assert.equal(nearby[0], 'bridge4');

    // Locate all bridges contained within the default radius of 1km from our point
    nearby = geo.findNearby(point.lat, point.lng);
    assert.equal(nearby.length, 3);
    assert.includeMembers(nearby, ['bridge3', 'bridge4', 'bridge5']);
  });

  it('should emit an error event when there is an error in geolocation', done => {
    geo.once('error', err => {
      assert.instanceOf(err, Error);
      done();
    });
    window.fakeGeo.simulateError(new Error('fake error'));
  });
});
