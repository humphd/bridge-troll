'use strict';

// A lot of the bridge names have odd spacing characters
const cleanName = name => {
  return name
    .replace(/\.{2,}/g, '') // get rid of ......
    .replace(/\s{2,}/g, '') // get rid of multiple spaces
    .replace(/-{2,}/g, '') // get rid of ------
    .replace(/\r?\n/g, ''); // get rid of embedded line breaks
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

  get title() {
    return `${this.name} [${this.year}]`;
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
