var express = require('express');
var path = require('path');
var cors = require('./middlewares/cors');

module.exports = function (app, config) {
  app.set('port', process.env.PORT || 3000);
  app.use(cors.allowCORS);
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.sessionSecret
  }));
  // app.use(express.csrf());
  // app.use(function (req, res, next) {
  //   res.locals.token = req.session ? req.csrfToken() : '';
  //   res.locals.userId = req.session.userId || '';
  //   next();
  // });
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(app.router);

  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
};
