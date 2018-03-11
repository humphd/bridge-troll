'use strict';

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
    this.length = length;
    this.width = width;

    // https://developers.google.com/maps/documentation/urls/guide
    this.streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${
      this.lat
    },${this.lng}&heading=-45`;
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
      obj.built,
      obj.length,
      obj.width
    );
  }

  // Table structure for https://www.ontario.ca/data/bridge-conditions CSV file
  static get csvLayout() {
    return [
      'id',
      'structure',
      'hwy_name',
      'latitude',
      'longitude',
      'category',
      'subcategory1',
      'type1',
      'material1',
      'year_built',
      'last_major_rehab',
      'last_minor_rehab',
      'spans',
      'span_details',
      'deck_length',
      'width',
      'region',
      'county',
      'status',
      'owner',
      'last_inspection_date',
      'current_bci',
      '2013',
      '2012',
      '2011',
      '2010',
      '2009',
      '2008',
      '2007',
      '2006',
      '2005',
      '2004',
      '2003',
      '2002',
      '2001',
      '2000'
    ];
  }
}

module.exports = Bridge;
