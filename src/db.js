'use strict';

const Tile38 = require('tile38');
const client = new Tile38();

const Bridge = require('./bridge');
const bridgeJsonData = require('../data/bridge-data.json');
const bridges = {};

module.exports.init = () => {

    let promises = bridgeJsonData.map(b => {
        let bridge = Bridge.fromObject(b);

        // Deal with invalid data in the dataset (not all bridges have lat/lng)
        if(!(bridge.id && bridge.lat && bridge.lng)) {
            console.warn(`Skipping bridge: '${bridge.name}', missing data`);
            return Promise.resolve();
        }

        // Record this bridge object in our database
        bridges[bridge.id] = bridge;

        // Set bridge position info in tile38
        return client.set('bridge', bridge.id, [bridge.lat, bridge.lng]);
    });

    return Promise.all(promises);
};

module.exports.lookup = (lat, lng, radius) => {
    return new Promise((resolve, reject) => {
        client
            .nearbyQuery('bridge')
            .point(lat, lng, radius)
            .execute()
            .then(response => {
                let results = response.objects;
                let nearbyBridges;
                // If we don't get back an array of objects, use empty list
                if(!results) {
                    nearbyBridges = [];
                } else {
                    // Otherwise, get the full Bridge objects for each id returned
                    nearbyBridges = results.map(result => bridges[result.id]);
                }
                resolve(nearbyBridges);
            })
            .catch(err => reject(err));
    });
};

module.exports.close = () => {
    return client.quit();
};
