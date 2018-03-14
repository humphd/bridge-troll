'use strict';

const chai = require('chai');
const assert = chai.assert;

const Bridge = require('../src/bridge');

describe('Bridge module', () => {
  // Common data for constructing bridge instances
  let id = '1';
  let name = 'name';
  let lat = 43.0;
  let lng = -80.0;
  let year = 1965;
  let length = 14;
  let width = 8;

  describe('Bridge Constructor', () => {
    it('should create a Bridge object with expected properties', () => {
      let bridge = new Bridge(id, name, lat, lng, year, length, width);
      assert.equal(bridge.id, id);
      assert.equal(bridge.name, name);
      assert.equal(bridge.lat, lat);
      assert.equal(bridge.lng, lng);
      assert.equal(bridge.year, year);
      assert.equal(bridge.length, length);
      assert.equal(bridge.width, width);
    });

    it('should remove whitespace in name', () => {
      let nameWithWhitespace = '  name     ';
      let name = 'name';
      let bridge = new Bridge(
        id,
        nameWithWhitespace,
        lat,
        lng,
        year,
        length,
        width
      );
      assert.equal(bridge.name, name);
    });

    it('should remove two or more .. in name', () => {
      let nameWithPeriods = 'name.......';
      let name = 'name';
      let bridge = new Bridge(
        id,
        nameWithPeriods,
        lat,
        lng,
        year,
        length,
        width
      );
      assert.equal(bridge.name, name);
    });

    it('should remove two or more -- in name', () => {
      let nameWithDashes = 'name------------';
      let name = 'name';
      let bridge = new Bridge(
        id,
        nameWithDashes,
        lat,
        lng,
        year,
        length,
        width
      );
      assert.equal(bridge.name, name);
    });

    it('should remove \r\n or \n in name', () => {
      let nameWithNewlines = '\nname\r\n';
      let name = ' name ';
      let bridge = new Bridge(
        id,
        nameWithNewlines,
        lat,
        lng,
        year,
        length,
        width
      );
      assert.equal(bridge.name, name);
    });
  });

  describe('Bridge.title Getter', () => {
    it('should properly combine name and year into one', () => {
      let bridge = new Bridge(id, name, lat, lng, year, length, width);

      assert.equal(bridge.name, 'name');
      assert.equal(bridge.year, 1965);
      assert.equal(bridge.title, 'name [1965]');
    });
  });

  describe('Bridge.streetViewUrl Getter', () => {
    it('should properly create a valid Google Street View URL', () => {
      let lat = 43.7965;
      let lng = -79.3476;
      let bridge = new Bridge(id, name, lat, lng, year, length, width);

      assert.equal(bridge.lat, lat);
      assert.equal(bridge.lng, lng);
      assert.equal(
        bridge.streetViewUrl,
        'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=43.7965,-79.3476&heading=-45'
      );
    });
  });

  describe('Bridge.fromCsvRecord()', () => {
    it('should properly parse a CSV record object into a Bridge instance', () => {
      let record = {
        id: id,
        structure: name,
        latitude: lat,
        longitude: lng,
        year_built: year,
        deck_length: length,
        width: width
      };
      let bridge = Bridge.fromCsvRecord(record);
      assert.equal(bridge.id, id);
      assert.equal(bridge.name, name);
      assert.equal(bridge.lat, lat);
      assert.equal(bridge.lng, lng);
      assert.equal(bridge.year, year);
      assert.equal(bridge.length, length);
      assert.equal(bridge.width, width);
    });
  });

  describe('Bridge.fromObject()', () => {
    it('should properly parse an Object parsed from JSON into a Bridge instance', () => {
      let o = {
        id: id,
        name: name,
        lat: lat,
        lng: lng,
        year: year,
        length: length,
        width: width
      };
      let bridge = Bridge.fromObject(o);
      assert.equal(bridge.id, id);
      assert.equal(bridge.name, name);
      assert.equal(bridge.lat, lat);
      assert.equal(bridge.lng, lng);
      assert.equal(bridge.year, year);
      assert.equal(bridge.length, length);
      assert.equal(bridge.width, width);
    });
  });
});
