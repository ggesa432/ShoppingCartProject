const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: require.resolve('path-browserify'),
    querystring: require.resolve('querystring-es3'),
    vm: require.resolve('vm-browserify'),
  };
  return config;
};

