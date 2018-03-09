A friendly troll that lives under Ontario's bridges.

## Introduction

`bridge-troll` is an HTTP web service for getting information about bridges in
Ontario by geographic location data.  The data is freely available from the
Government of Ontario website:

https://www.ontario.ca/data/bridge-conditions

It is being used under the (Open Government Licence - Ontario](https://www.ontario.ca/page/open-government-licence-ontario)

## Installation

`bridge-troll` depends on node.js:

```
$ npm install -g parcel-bundler
$ npm install
```

## Running the Server

To start the server, use:

```
npm start
```

## Routes

Bridge information for a given location (i.e., `lat`, `lng`, and `radius`) is
available via the `/nearby` route:

```
GET /nearby/43.167233/-80.275567
```

This will return all bridges within a 1 km radius around the geographic point
`(43.167233, -80.275567)`. Results are returned as JSON, with a list of all bridges nearby:

```json
[
  {
    "id": "1 -  44/",
    "name": "NORTH PARK STEET UNDERPASS",
    "hwy": 403,
    "lat": 43.165918,
    "lng": -80.263791,
    "material": "Prestressed Precast Concrete",
    "type": "AASHTO Girder",
    "built": 1962,
    "majorRehab": 2013,
    "minorRehab": 2009,
    "length": 60.8,
    "width": 18.4,
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=43.165918%2C-80.263791"
  },
  {
    "id": "1 -  32/",
    "name": "Highway 24 Underpass at Highway 403",
    "hwy": 403,
    "lat": 43.167233,
    "lng": -80.275567,
    "material": "Prestressed Precast Concrete",
    "type": "AASHTO Girder",
    "built": 1965,
    "majorRehab": 2014,
    "minorRehab": 2009,
    "length": 65,
    "width": 25.4,
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=43.167233%2C-80.275567"
  },
  {
    "id": "1 - 143/",
    "name": "TOLLGATE ROAD UDERPASS",
    "hwy": 403,
    "lat": 43.167695,
    "lng": -80.279819,
    "material": "Prestressed Precast Concrete",
    "type": "AASHTO Girder",
    "built": 1965,
    "majorRehab": 2013,
    "minorRehab": 2003,
    "length": 78.1,
    "width": 12.3,
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=43.167695%2C-80.279819"
  }
]
```

If you desire a different radius value, you can provide one in metres:

```
GET /nearby/43.167233/-80.275567/10000
```

This will use a 10 km radius instead of the default 1 km.

## Ideas

* Add a `GET /random/:count?` that returns 1 or `count` random bridge records
* Do something with width/length data, maybe find bridges under a certain size?
* Bridge Avoidance system: input a route, detect if it cross any bridges (e.g., for flooding)
* Realtime information about a bridge as you move near it (i.e., drive/walk across bridge, get an info alert)
* "Troll Hunter" style game (Pokemon Go for bridges?), where you can collect "trolls" for each bridge.  Troll names and visuals could be procedurally generated.  Need some way to store this on a client so you can collect them.
* Given a geographic region (e.g., county), show all bridges, listing in order of when they last got rehab
