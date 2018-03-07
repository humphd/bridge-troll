'use strict';

const db = require('./db');
const express = require('express');
const app = express();

const ONE_KM = 1000;

app.get('/nearby/:lat/:lng/:radius?', (req, res) => {
    let lat = parseFloat(req.params.lat);
    let lng = parseFloat(req.params.lng);
    let radius = req.params.radius ? req.params.radius|0 : ONE_KM;

    if(!(isFinite(lat) && isFinite(lng))) {
        res.status(400).send('Invalid lat, lng value(s)');
        return;
    }

    db.lookup(lat, lng, radius)
        .then(bridges => {
            res.status(200).json(bridges);
        })
        .catch(err => {
            console.log('DB Error', err);
            res.status(500).send('Error performing query');
        });
});

module.exports = app;
