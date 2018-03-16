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

To run the web site in dev mode, use one of:

```
npm start
```

or

```
npm run debug
```

Both will build the site's resources, start a development web server
at `http://localhost:8080/`, and also watch for changes that need to be rebuilt.

The `npm run debug` option further enables enhanced debugging in the map and with
geolocation.  For example, you can double-click on the map to move your
position, zoom or move the map, and also use `window.fakeGeo` methods from the
console.  See `src/fake-geolocation.js` for info.

A number of other overrides are also possible when running in debug mode via the query string:

* `?collision=250` - specify the radius from the current position to collide with a bridge (default 50m)
* `?lat=...&lng=...` - specify the startup `lat` and `lng`.  If none is given Seneca@York is used.

### Logging

You can enable different log levels, and see more info in the browser `console`.
Via the query string, set your desired log level:

```
http://localhost:8080/?loglevel=debug
http://localhost:8080/?loglevel=info
http://localhost:8080/?loglevel=warn
http://localhost:8080/?loglevel=error
```

### Tests

You can run the test suite using:

```
npm run test
```

This will run a few things:

1. `eslint` to check for any lint issues
2. `prettier` to see if files need to be formatted (i.e., run `npm run prettier`) if it fails
3. `karma-headless` to run the unit tests in a headless version of Chrome

After the tests have finished, a test code coverage report will be generated in `coverage/index.html`
and will show you which parts of the code are being run during testing, and which are not.
You can see a graphical coverage report by doing:

```
npm run coverage
```

See below for other ways to run these. 

### Scripts

You can use various `npm scripts` to help accomplishing things:

```
npm run generate-bridge-json
    parse data/2536_bridge_conditions.csv into data/bridge-data.json

npm run build
    bundle index.html into dist/ (suitable for production)

npm run eslint
    run eslint and report any errors that can't be automatically fixed

npm run prettier
    run prettier on all source files, fixing any formatting issues

npm run lint
    check that all flies pass eslint and prettier

npm run debug
    build index.html and start a dev web server, enabling enhanced debugging

npm run karma-headless
    run unit tests with ChromeHeadless (default)

npm karma-firefox
    run unit tests with Firefox (must be installed locally)

npm run karma-chrome
    run unit tests with Chrome (must be installed locally)

npm run karma-edge
    run unit tests with Edge (must be installed locally)
```
