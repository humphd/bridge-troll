'use strict';

// Map the bridge records (by numeric id) to an image card

const request = require('request');
const unzip = require('unzip');
const tempDir = require('temp-dir');
const mkdirp = require('mkdirp');
const path = require('path');
const cp = require('cp');
const find = require('find');

const iconsUrl =
  'http://game-icons.net/archives/svg/zip/000000/transparent/game-icons.net.svg.zip';

const dataDir = path.join(__dirname, '..', 'data');
const jsonBridgeData = path.join(dataDir, 'bridge-data.json');
const cardsDir = path.join(dataDir, 'cards');
const iconsDir = path.join(tempDir, 'icons');

// Step 1: make sure we can access the bridge json data, error if not
let bridges;
try {
  bridges = require(jsonBridgeData);
} catch (err) {
  console.log(
    `Unable to load ${jsonBridgeData}. Run \`npm run generate-bridge-json\` first`,
    err
  );
  process.exit(1);
}

// Step 2: download and unzip the icons we need from http://game-icons.net/
console.log(`Downloading and unzipping ${iconsUrl}...`);
request
  .get(iconsUrl)
  .pipe(unzip.Extract({ path: iconsDir }))
  .on('error', err => {
    console.log(`Unable to download and unzip ${iconsUrl}: ${err.message}`);
    process.exit(1);
  })
  .on('close', () => {
    // Step 3: create an SVG file for each bridge we have in data/cards/ based on id
    console.log(`Processing downloaded images into ${cardsDir}...`);
    find.file(/\.svg$/, iconsDir, imageFilenames => {
      mkdirp(cardsDir, err => {
        if (err && err.code !== 'EEXIST') {
          console.log(`Unable to create ${cardsDir}: ${err.message}`);
          process.exit(1);
        }

        // Go through all the bridges we have, and using their id, copy an svg
        // file from the images we downloaded into data/cards/{id}.svg, such
        // that every bridge will have an associated (and unique) svg card.
        Promise.all(
          bridges.map(bridge => {
            return new Promise((resolve, reject) => {
              let id = bridge.id;
              let imageFilename = imageFilenames[id];
              let cardFilename = path.join(cardsDir, id + '.svg');
              cp(
                imageFilename,
                cardFilename,
                err => (err ? reject(err) : resolve())
              );
            });
          })
        )
          .then(() =>
            console.log(
              `Finished creating ${bridges.length} cards in ${cardsDir}`
            )
          )
          .catch(err => {
            console.log(`Error creating ${cardsDir}: ${err.message}`);
          });
      });
    });
  });
