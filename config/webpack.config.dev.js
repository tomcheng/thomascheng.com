var path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// TODO: hide this behind a flag and eliminate dead code on eject.
// This shouldn't be exposed to the user.
var isInNodeModules = 'node_modules' ===
  path.basename(path.resolve(path.join(__dirname, '..', '..')));
var relativePath = isInNodeModules ? '../../..' : '..';
var isInDebugMode = process.argv.some(arg =>
  arg.indexOf('--debug-template') > -1
);
if (isInDebugMode) {
  relativePath = '../template';
}
var srcPath = path.resolve(__dirname, relativePath, 'src');
var nodeModulesPath = path.join(__dirname, '..', 'node_modules');
var indexHtmlPath = path.resolve(__dirname, relativePath, 'index.html');
var faviconPath = path.resolve(__dirname, relativePath, 'favicon.ico');
var buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..', 'build');

module.exports = {
  devtool: 'eval',
  entry: [
    require.resolve('webpack-dev-server/client') + '?http://localhost:3000',
    require.resolve('webpack/hot/dev-server'),
    path.join(srcPath, 'index')
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: buildPath,
    pathinfo: true,
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    root: srcPath,
    extensions: ['', '.js', '.jsx']
  },
  resolveLoader: {
    root: nodeModulesPath,
    moduleTemplates: ['*-loader']
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        include: srcPath
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        include: srcPath,
        loader: 'babel',
        query: require('./babel.dev')
      },
      {
        test: /\.sass$/,
        loader: "style!css!postcss!sass?indentedSyntax"
      },
      {
        test: /\.css$/,
        include: srcPath,
        loader: 'style!css!postcss'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'file'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/svg+xml"
      },
      {
        test: /\.(mp4|webm)$/,
        loader: 'url?limit=10000'
      }
    ]
  },
  postcss: function() {
    return [autoprefixer];
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: indexHtmlPath,
      favicon: faviconPath
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }),
    // Note: only CSS is currently hot reloaded
    new webpack.HotModuleReplacementPlugin()
  ]
};