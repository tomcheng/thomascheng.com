'use strict';

var webpack = require("webpack");
var config = require('./webpack.base.config.js');

if (process.env['NODE_ENV'] !== 'test') {
  config.entry = [
    'webpack-dev-server/client?http://192.168.0.104:2992',
    'webpack/hot/dev-server',
    config.entry
  ];
}

config.devtool = 'eval-source-map';

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin()
]);

config.module.loaders = config.module.loaders.concat([
  {test: /\.jsx?$/, loaders: [ 'react-hot', 'babel'], exclude: /node_modules/}
]);

config.host = '192.168.0.104';

config.port = '2992';

config.inline = true;

module.exports = config;
