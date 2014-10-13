var express = require('express');
var path = require('path');
var access = require('./middlewares/access');

module.exports = function (app, config) {
  app.set('port', process.env.PORT || 3000);
  app.use(access.allowCORS);
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.sessionSecret
  }));
  app.use(app.router);

  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
};
