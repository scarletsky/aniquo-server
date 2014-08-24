var env = process.env.NODE_ENV || 'development';
var config = require('../config')[env];
var allowIps = config.allowIps;

exports.allowCORS = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

exports.allowAccess = function (req, res, next) {
  if (allowIps.indexOf(req.ip) === -1) {
    res.send(403);
  } else {
    next();
  }
}
