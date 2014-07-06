var User = require('../models').User;

exports.getUserByToken = function (req, res) {
  return res.send(req.user);
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
      name: regexpKeyword
    })
    .exec(function (err, users) {
      return res.send(users);
    });
};
