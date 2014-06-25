var User = require('../models').User;
var jwt = require('jsonwebtoken');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];

exports.authenticate = function (req, res) {
  var username = req.param('username');
  var password = req.param('password');

  User
    .findOne({
      name: username
    })
    .exec(function (err, user) {
      if (!user) {
        return res.send({error: '用户不存在'});
      }

      if (user.auth(password)) {
        var token = jwt.sign(user, config.sessionSecret, {
          expiresInMinutes: 60*5
        });
        return res.send({token: token});
      } else {
        return res.send({error: '用户名或密码错误'});
      }
    });
};
