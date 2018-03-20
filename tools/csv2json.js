'use strict';

// Parse the CSV file, filter out unnecessary columns, and write as JSON

const fs = require('fs');
const csvInput = 'data/2536_bridge_conditions.csv';
const jsonOutput = 'data/bridge-data.json';
const versionOutput = 'data/bridge-data-version.json';

const parse = require('csv-parse');
const transform = require('stream-transform');
const JSONStream = require('JSONStream');

const Bridge = require('../src/bridge');

const crypto = require('crypto');
const hash = crypto.createHash('md5');

// Table structure for https://www.ontario.ca/data/bridge-conditions CSV file.
// We parse, but ignore most of this.
const columns = [
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

fs
  .createReadStream(csvInput)
  .pipe(
    parse({
      columns, // pass set of columns we defined above
      auto_parse: true, // try to parse string data into JS types
      from: 5, // skip the first rows of metadata, labels
      trim: true // trim surrounding whitespace
    })
  )
  .pipe(transform(record => Bridge.fromCsvRecord(record)))
  .pipe(JSONStream.stringify())
  .pipe(
    transform(json => {
      // Hash the data as we go, so we can version this
      hash.update(json);
      return json;
    })
  )
  .pipe(fs.createWriteStream(jsonOutput))
  .on('error', err =>
    console.log(`Error writing ${jsonOutput}: ${err.message}`)
  )
  .on('finish', () => {
    // Write out the version info too
    let versionInfo = {
      version: hash.digest('hex'),
      created: new Date()
    };
    fs.writeFile(versionOutput, JSON.stringify(versionInfo), err => {
      if (err) {
        console.log(`Error writing ${versionOutput}: ${err.message}`);
        return;
      }
      console.log(`Wrote ${jsonOutput} and ${versionOutput}`);
    });
  });
