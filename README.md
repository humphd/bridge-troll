A friendly troll that lives under Ontario's bridges.

## Introduction

`bridge-troll` is a browser based geolocation game based on open bridge data in
Ontario by geographic location.  The data is freely available from the
Government of Ontario website:

https://www.ontario.ca/data/bridge-conditions

It is being used under the [Open Government Licence - Ontario](https://www.ontario.ca/page/open-government-licence-ontario)

## Installation

`bridge-troll` depends on node.js:

```
$ npm install
```

## Development

To run the web site in dev mode, use:

```
npm start
```

This will build the site's resources, start a development web server
at `http://localhost:1234`, and also watch for changes that need to be rebuilt.

### Logging

You can enable different log levels, and see more info in the browser `console`.
Via the query string, set your desired log level:

```
http://localhost:1234?loglevel=debug
http://localhost:1234?loglevel=warn
http://localhost:1234?loglevel=info
http://localhost:1234?loglevel=error
```
### Override Geolocation Data for testing

You can configure geolocation to work manually vs. automatically in the browser:

```
FAKE_GEO=1 npm start
```

You can now double-click on the map to move your position, and also use
`window.fakeGeo` methods from the console.

### Scripts

You can use various `npm scripts` to help accomplishing things:

```
npm run generate-bridge-json
    parse data/2536_bridge_conditions.csv into data/bridge-data.json

npm run build
    bundle index.html into dist/ (suitable for production)

npm run eslint
    run eslint and report any errors

npm run prettier
    run prettier on all source files, fixing any formatting issues

npm run lint
    check that all flies pass eslint and prettier
```

