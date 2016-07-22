var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var compress = require('compression');
var layouts = require('express-ejs-layouts');

var port = Number(process.env['PORT'] || 3001);
var devPort = 2992;

app.set('view engine', 'ejs');
app.set('layout', 'index');
app.set('views', path.join(process.cwd(), '/server/views'));

app.use(compress());
app.use(layouts);
app.use("/client", express.static(path.join(process.cwd(), '/client')));

app.disable('x-powered-by');

app.get('/*', function(req, res) {
  res.render('index', {
    env: {
      production: process.env['NODE_ENV'] === 'production',
      assets: JSON.parse(fs.readFileSync(path.join(process.cwd(), 'assets.json'))),
      devPort: devPort
    }
  });
});

app.listen(port, function () {
  console.log('server running at localhost:' + port + ', go refresh and see magic');
});

if (process.env['NODE_ENV'] !== 'production') {
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');
  var webpackConfig = require('./webpack.dev.config');

  new WebpackDevServer(webpack(webpackConfig), {
    publicPath: '/client/',
    contentBase: './client/',
    inline: true,
    hot: true,
    stats: false,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:' + port,
      'Access-Control-Allow-Headers': 'X-Requested-With'
    }
  }).listen(devPort, 'localhost', function (err, result) {
    if (err) { console.log(err); }

    console.log('webpack dev server listening on localhost:' + devPort);
  });
}
