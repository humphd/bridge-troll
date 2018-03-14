'use strict';

const chai = require('chai');
const assert = chai.assert;

describe('bridges JSON module', () => {
  const bridges = require('../src/bridges');

  /**
   * Data in the array should look like this:
   *
   * id: '1 -  32/',
   * name: 'Highway 24 Underpass at Highway 403',
   * lat: 43.167233,
   * lng: -80.275567,
   * year: 1965,
   * length: 65,
   * width: 25.4
   */

  it('should be Array of Object with expected layout, types', () => {
    assert.isArray(bridges);
    let o = bridges[0];

    assert.isString(o.id);
    assert.isString(o.name);
    assert.isNumber(o.lat);
    assert.isNumber(o.lng);
    assert.isNumber(o.year);
    assert.isNumber(o.length);
    assert.isNumber(o.width);
  });
});
