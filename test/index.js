'use strict';

/**
 * Testing with webpack + coverage - https://webpack.js.org/loaders/istanbul-instrumenter-loader/
 */

// Force debug mode
//process.env.DEBUG = 1;

// requires all tests in `test/**/*.js`
const tests = require.context('./', true, /\.js$/);

tests.keys().forEach(tests);

// requires all components in `src/**/index.js`
const components = require.context('../src/', true, /index\.js$/);

components.keys().forEach(components);
