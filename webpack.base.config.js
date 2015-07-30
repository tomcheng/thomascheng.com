var webpack = require("webpack");

var path = require('path');
var objectAssign = require('object-assign');

var _env = process.env['NODE_ENV'];

var env = {
  production: _env === 'production',
  staging: _env === 'staging',
  test: _env === 'test',
  development: _env === 'development' || typeof _env === 'undefined'
};

objectAssign(env, {
  build: (env.production || env.staging)
});

module.exports = {
  target: 'web',

  entry: './client/entry.jsx',

  output: {
    path: path.join(process.cwd(), '/client'),
    pathInfo: true,
    publicPath: 'http://192.168.0.104:2992/client/',
    filename: 'main.js'
  },

  resolve: {
    modulesDirectories: [
      'web_modules',
      'node_modules',
      'client'
    ],
    extentions: ['js', 'jsx', 'sass']
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: env.development,
      __STAGING__: env.staging,
      __PRODUCTION__: env.production,
      __CURRENT_ENV__: "'" + (_env) + "'"
    })
  ],

  module: {
    preLoaders: [
      {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
    ],

    loaders: [{
      test: /\.sass$/,
      loader: "style!css!autoprefixer?browsers=last 2 version!sass?indentedSyntax"
    }, {
      test: /\.(png|jpe?g)$/,
      loader: 'url-loader?limit=8192'
    }, {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&mimetype=application/octet-stream"
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: "file"
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&minetype=image/svg+xml"
    }],

    noParse: /\.min\.js/
  }

};
