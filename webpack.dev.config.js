'use strict';

var webpack = require("webpack");
var config = require('./webpack.base.config.js');

if (process.env['NODE_ENV'] !== 'test') {
  config.entry = [
    'webpack-dev-server/client?http://localhost:2992',
    'webpack/hot/dev-server',
    config.entry
  ];
}

config.devtool = 'eval-source-map';

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin()
]);

config.module.loaders = config.module.loaders.concat([
  {
    test: /\.jsx?$/,
    loaders: ['react-hot', 'babel?presets[]=es2015,presets[]=react'],
    exclude: /node_modules/
  }
]);

module.exports = config;
