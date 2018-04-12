'use strict';

const chai = require('chai');
const assert = chai.assert;

const TrollBridge = require('../src/troll-bridge');

describe('TrollBridge module', () => {
  // Common data for constructing bridge instances
  const id = '1';
  const name = 'name';
  const lat = 43.0;
  const lng = -80.0;
  const year = 1965;
  const length = 14;
  const width = 8;

  it('should extend Bridge with new properties', () => {
    const trollBridge = new TrollBridge(
      id,
      name,
      lat,
      lng,
      year,
      length,
      width
    );

    assert.equal(trollBridge.idbKey, 'bridge::1');
    assert.equal(TrollBridge.idFromIdbKey(trollBridge.idbKey), trollBridge.id);
    assert.equal(trollBridge.cardUrl, `../data/cards/${id}.svg`);
    assert.equal(
      trollBridge.streetViewUrl,
      `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=-45`
    );
    assert.instanceOf(trollBridge.cardImgEl, HTMLImageElement);
  });
});
