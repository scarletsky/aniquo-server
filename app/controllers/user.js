var User = require('../models').User;

exports.getUserByToken = function (req, res) {
  var userId = req.user._id;

  User
    .findById(userId, '-passwordHash')
    .exec(function (err, user) {
      return res.send(user);
    });
};

exports.getUsers = function (req, res) {
  User
    .find()
    .limit(20)
    .exec(function (err, users) {
      return res.send(users);
    });
};

exports.getUserById = function (req, res) {
  var userId = req.params.userId;

  User
    .findById(userId, function (err, user) {
      return res.send(user);
    });
};

exports.getUsersByKeyword = function (req, res) {
  var keyword = req.query.kw;
  var regexpKeyword = new RegExp('.*' + keyword + '.*');

  User
    .find({
      username: regexpKeyword
    })
    .exec(function (err, users) {
      return res.send(users);
    });
};

exports.putUser = function (req, res) {
  var userId = req.user._id;
  var isChangePassword = req.param('oldPassword') && req.param('newPassword') ? true : false;

  if (!isChangePassword) {
    var data = {};
    var fields = ['nickname', 'site', 'info', 'avatar'];

    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      var value = req.param(field);

      if (value) {
        data[field] = value;
      }
    }

    User
      .findByIdAndUpdate(userId, data, function (err, user) {
        return res.send(user);
      });

  } else if (isChangePassword) {
    var oldPassword = req.param('oldPassword');
    var newPassword = req.param('newPassword');

    User
      .findById(userId)
      .exec(function (err, user) {
        if (!user.auth(oldPassword)) {
          return res.send(403, {error: '密码错误'});
        } else {
          user.password = newPassword;
          user.save(function (err, user) {
            user = user.toObject();
            delete user.passwordHash;
            return res.send(200, user);
          });
        }
      });
  }
};
