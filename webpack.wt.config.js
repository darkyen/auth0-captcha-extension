var Request = require('request-promise');
var Webpack = require('webpack');
var _       = require('lodash');

var LIST_MODULES_URL = 'https://webtask.it.auth0.com/api/run/wt-tehsis-gmail_com-1?key=eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiJmZGZiOWU2MjQ0YjQ0YWYyYjc2YzAwNGU1NjgwOGIxNCIsImlhdCI6MTQzMDMyNjc4MiwiY2EiOlsiZDQ3ZDNiMzRkMmI3NGEwZDljYzgwOTg3OGQ3MWQ4Y2QiXSwiZGQiOjAsInVybCI6Imh0dHA6Ly90ZWhzaXMuZ2l0aHViLmlvL3dlYnRhc2tpby1jYW5pcmVxdWlyZS90YXNrcy9saXN0X21vZHVsZXMuanMiLCJ0ZW4iOiIvXnd0LXRlaHNpcy1nbWFpbF9jb20tWzAtMV0kLyJ9.MJqAB9mgs57tQTWtRuZRj6NCbzXxZcXCASYGISk3Q6c';

module.exports = Request.get(LIST_MODULES_URL, { json: true }).then(function (data) {
  var modules = data.modules;

  modules = _.filter(modules, function (e) { return e.name !== 'auth0-oauth2-express'});

  return {
    entry: './webtask',
    output: {
      path: './build',
      filename: 'bundle.js',
      library: true,
      libraryTarget: 'commonjs2',
    },
    module: {
      loaders: [
        { test: /\.js/, loader: require.resolve('babel-loader') },
        { test: /\.pug$/, loader: require.resolve('jade-loader') },
        { test: /\.json$/, loader: 'json' }
      ]
    },
    externals: _(modules).reduce(function (acc, module) {
        return _.set(acc, module.name, true);
    }, {
      // Not provisioned via verquire
      'auth0-api-jwt-rsa-validation': true,
      'auth0-authz-rules-api': true,
      'auth0-oauth2-express': false,
      'auth0-sandbox-ext': true,
      'detective': true,
      'sandboxjs': true,
      'webtask-tools': true,
      'auth0@2.1.0': true,
      // For some reason was failing
      'jsonwebtoken@7.1.9': true,
    }),
    plugins: [
      new Webpack.optimize.DedupePlugin()
    ],
    resolve: {
      modulesDirectories: ['node_modules'],
      root: __dirname,
      alias: {},
    },
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false
    }
  };
});
