'use strict';

// Google Maps URL API - https://developers.google.com/maps/documentation/urls/guide
const GMAPS_API_URL = 'https://www.google.com/maps/search/?api=1';

// A lot of the bridge names have odd spacing characters
const cleanName = name => {
    return name
        .replace(/\.{2,}/, '')  // get rid of ......
        .replace(/\s{2,}/, '')  // get rid of multiple spaces
        .replace(/-{2,}/, '')   // get rid of ------
        .replace(/\r?\n/, ' '); // get rid of embedded line breaks
};

class Bridge {
    constructor(id, name, hwy, lat, lng, material, type, built, majorRehab,
        minorRehab, length, width)
    {
        this.id = id;
        this.name = cleanName(name);
        this.hwy = hwy;
        this.lat = lat;
        this.lng = lng;
        this.material = material;
        this.type = type;
        this.built = built;
        this.majorRehab = majorRehab;
        this.minorRehab = minorRehab;
        this.length = length;
        this.width = width;

        // https://developers.google.com/maps/documentation/urls/guide
        let position = encodeURIComponent(`${this.lat},${this.lng}`);
        this.mapUrl = `${GMAPS_API_URL}&query=${position}`;
    }

    // Create new Bridge from CSV record data
    static fromCsvRecord(record) {
        return new Bridge(
            record['id'],
            record['structure'],
            record['hwy_name'],
            record['latitude'],
            record['longitude'],
            record['material1'],
            record['type1'],
            record['year_built'],
            record['last_major_rehab'],
            record['last_minor_rehab'],
            record['deck_length'],
            record['width']
        );
    }

    // Create new Bridge from existing JS Object (e.g., parsed JSON)
    static fromObject(obj) {
        return new Bridge(
            obj.id,
            obj.name,
            obj.hwy,
            obj.lat,
            obj.lng,
            obj.material,
            obj.type,
            obj.built,
            obj.majorRehab,
            obj.minorRehab,
            obj.length,
            obj.width
        );
    }

    // Table structure for https://www.ontario.ca/data/bridge-conditions CSV file
    static get csvLayout() {
        return [
            'id', 'structure', 'hwy_name', 'latitude', 'longitude', 'category',
            'subcategory1', 'type1', 'material1', 'year_built', 'last_major_rehab',
            'last_minor_rehab', 'spans', 'span_details', 'deck_length', 'width',
            'region', 'county', 'status', 'owner', 'last_inspection_date',
            'current_bci', '2013', '2012', '2011', '2010', '2009', '2008', '2007',
            '2006', '2005', '2004', '2003', '2002', '2001', '2000'
        ];
    }
}

module.exports = Bridge;
