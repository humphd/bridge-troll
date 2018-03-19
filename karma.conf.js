// Karma configuration
// https://karma-runner.github.io/2.0/config/configuration-file.html

const path = require('path');

// Reuse our existing webpack.config.js with some minor changes
// so that we an get useful coverage info mapped to the original files.
let webpackConfig = require('./webpack.config.js');
webpackConfig.module.rules.push({
  test: /\.js$/,
  use: { loader: 'istanbul-instrumenter-loader' },
  include: path.resolve('src/')
});

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    frameworks: ['mocha', 'chai'],

    files: ['test/index.js'],

    preprocessors: {
      'test/index.js': ['webpack']
    },

    webpack: webpackConfig,

    reporters: ['mocha', 'coverage-istanbul'],

    coverageIstanbulReporter: {
      reports: ['html', 'text-summary'],
      dir: path.join(__dirname, 'coverage'),
      combineBrowserReports: true,
      fixWebpackSourcePaths: true
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
