A friendly troll that lives under Ontario's bridges.

## Introduction

`bridge-troll` is an HTTP web service for getting information about bridges in
Ontario by geographic location data.  The data is freely available from the
Government of Ontario website:

https://www.ontario.ca/data/bridge-conditions

It is being used under the (Open Government Licence - Ontario](https://www.ontario.ca/page/open-government-licence-ontario)

## Installation

`bridge-troll` depends on node.js and [Docker](https://docs.docker.com/install/).
After installing both, run:

```
npm install
npm run setup
```

This will download the [Tile38](http://tile38.com/) [docker image](https://hub.docker.com/r/tile38/tile38/).

## Running the Server

To start the server, use:

```
npm start
```

This will also start the [Tile38](http://tile38.com/) docker server image. When the
process exists, docker will stop the server, removing the running container.
You can also manually run various docker commands:

```
# to start the server
npm run start-tile38
# to stop the running server
npm run stop-tile38
# to delete the container
npm run destroy-tile38
```
 
NOTE: in development, the tile38 server only runs when the node app is running.

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
