var wechat = require('wechat');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];

exports.reply = wechat(config.wechat, function(req, res, next) {
    var message = req.weixin;
    res.reply('hehe');
});
