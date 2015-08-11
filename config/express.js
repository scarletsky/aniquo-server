var express = require('express');
var morgan = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var compression = require('compression');
var errorhandler = require('errorhandler');
var access = require('./middlewares/access');

module.exports = function(app, config) {
    app.set('port', process.env.PORT || 3000);
    app.use(access.allowCORS);
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(compression());
    app.use(session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true
    }));

    if ('development' == app.get('env')) {
        app.use(errorhandler());
    }
};
