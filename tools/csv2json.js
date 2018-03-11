'use strict';

const fs = require('fs');
const parse = require('csv-parse');
const transform = require('stream-transform');
const JSONStream = require('JSONStream');

const Bridge = require('../src/bridge');

// Parse the CSV file, filter out unnecessary columns, and write as JSON
fs.createReadStream('data/2536_bridge_conditions.csv')
    .pipe(parse({
        columns: Bridge.csvLayout, // pass set of columns we defined above 
        auto_parse: true,          // try to parse string data into JS types
        from: 5,                   // skip the first rows of metadata, labels
        trim: true                 // trim surrounding whitespace    
    }))
    .pipe(transform(record => Bridge.fromCsvRecord(record)))
    .pipe(JSONStream.stringify())
    .pipe(fs.createWriteStream('data/bridge-data.json'))
    .on('error', err => console.log('Error writing JSON data: ' + err.message))
    .on('finish', () => console.log('Wrote data/bridge-data.json'));
