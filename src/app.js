'use strict';

const db = require('./db');
const express = require('express');
const app = express();

app.get('/nearby/:lat/:lng/:radius?', (req, res) => {
    let lat = parseFloat(req.params.lat);
    let lng = parseFloat(req.params.lng);
    let radius = parseFloat(req.params.radius);

    // Only `lat` and `lng` are required to exist, and be floats
    if(!(isFinite(lat) && isFinite(lng))) {
        res.status(400).send('Invalid lat, lng value(s)');
        return;
    }

    let nearby = db.lookup(lat, lng, radius);
    res.status(200).json(nearby);
});

module.exports = app;
