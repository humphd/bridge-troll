'use strict';

const db = require('./db');
const geo = require('./geo');

let nearby = db.lookup(48.3802, -89.4983, 50000);
console.log(nearby);

geo.events.on('bridges', nearby => {
    console.log(nearby);
});
