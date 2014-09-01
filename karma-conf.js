module.exports = function (config) {
  config.set({

    basePath: '',

    frameworks: [
      'mocha',
      'chai',
      'sinon'
    ],

    files: [
      'bower_components/es5-shim/es5-shim.js',
      'js/**/*.spec.js'
    ],

    exclude: [],

    reporters: [
      'progress',
      'dots'
    ],

    port: 9878,
    runnerPort: 9201,

    colors: true,
    logLevel: "INFO", // karma.LOG_INFO,

    preprocessors: {
      "js/**/*.spec.js": [
        'webpack'
      ]
    },

    webpack: {
      cache: true,
      module: {
      }
    },

    webpackServer: {
      stats: {
        colors: true
      }
    },

    browsers: [
      'PhantomJS'
    ],

    captureTimeout: 60000,
    singleRun: true

  });
};
