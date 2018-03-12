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

## Building the Site

To build the site's resources in to `dist/`, do the following:

```
npm run build
```

You can now serve the contents of `dist/` as a website

## Development

To run the web site in dev mode, use:

```
npm start
```

This will build the site's resources, start a development web server
at `http://localhost:1234`, and also watch for changes that need to be rebuilt.
