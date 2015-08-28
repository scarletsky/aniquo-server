var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var User = require('../models').User;
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var mail = require('../utils/mail');

function genLoginToken(user) {
    _user = {
        _id: user._id,
        email: user.email
    };

    var token = jwt.sign(user, config.sessionSecret, {
        expiresInMinutes: 60 * 24 * 30
    });

    return token;
}

exports.login = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User
        .findOne({
            email: email
        })
        .exec(function(err, user) {
            if (!user) {
                return res.status(403).send({
                    error: '用户不存在'
                });
            }

            if (user.auth(password)) {
                user = user.toObject();
                delete user.passwordHash;
                var token = genLoginToken(user);

                return res.status(200).send({
                    user: user,
                    token: token
                });
            } else {
                return res.status(403).send({
                    error: '用户名或密码错误'
                });
            }
        });
};

exports.signup = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User
        .findOne({
            email: email
        })
        .exec(function(err, user) {
            if (user) {
                return res.status(403).send({
                    error: '该用户已存在'
                });
            }

            user = new User({
                email: email,
                password: password
            });

            user.save(function(err, user) {

                mail.sendVerifyEmail(email, user._id, function(err, _res) {

                    user = user.toObject();
                    delete user.passwordHash;
                    var token = genLoginToken(user);

                    return res.status(200).send({
                        user: user,
                        token: token
                    });
                });
            });
        });
};

exports.verify = function(req, res) {
    var userId = req.params.userId;
    var token = req.query.confirm_token;

    console.log(userId);
    console.log(token);

    var md5 = crypto.createHash('md5');
    var testToken = md5.update(config.sessionSecret + userId).digest('hex');
    if (token === testToken) {

        User
            .findById(userId)
            .exec(function(err, user) {

                if (user.activated === true) {

                    user = user.toObject();
                    delete user.passwordHash;
                    var token = genLoginToken(user);

                    return res.status(403).send({
                        user: user,
                        token: token
                    });
                }

                user.activated = true;
                user.save(function(err, user) {

                    user = user.toObject();
                    delete user.passwordHash;
                    var token = genLoginToken(user);

                    return res.status(200).send({
                        user: user,
                        token: token
                    });

                });
            });

    } else {
        return res.status(403).send({
            error: '帐号验证失败'
        });
    }
};
