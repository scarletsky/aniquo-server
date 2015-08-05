var jwt = require('jsonwebtoken');
var User = require('../models').User;
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];

exports.login = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User
        .findOne({
            email: email
        })
        .exec(function (err, user) {
            if (!user) {
                return res.status(403).send({error: '用户不存在'});
            }

            if (user.auth(password)) {
                user = user.toObject();
                user = {
                    _id: user._id,
                    email: user.email
                };
                var token = jwt.sign(user, config.sessionSecret, {
                    expiresInMinutes: 60*5
                });

                return res.status(200).send({
                    user: user,
                    token: token
                });
            } else {
                return res.status(403).send({error: '用户名或密码错误'});
            }
        });
};

exports.signup = function (req, res) {
    var email = req.param('email');
    var password = req.param('password');

    User
        .findOne({
            email: email
        })
        .exec(function (err, user) {
            if (user) {
                return res.status(403).send({error: '该用户已存在'});
            }

            user = new User({
                email: email,
                password: password
            });

            user.save(function (err, user) {
                user = user.toObject();
                delete user.passwordHash;
                var token = jwt.sign(user, config.sessionSecret, {
                    expiresInMinutes: 60*5
                });

                return res.status(200).send({
                    user: user,
                    token: token
                });
            });
        });
};
