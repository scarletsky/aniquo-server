/**
 * Module dependencies.
 */

var http = require('http');

var express = require('express');
var mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

var connect = function () {
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    };
    mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', function (err) {
    console.log(err);
});

mongoose.connection.on('disconnected', function () {
    console.log('mongodb had disconnected. trying to reconnect now.');
    connect();
});

var app = express();
require('./config/express')(app, config);
require('./config/api')(app, config);

app.listen(app.get('port'));
