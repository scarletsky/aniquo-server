var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var qn = require('qn');
var client = qn.create({
    accessKey: config.qiniu.accessKey,
    secretKey: config.qiniu.secretKey,
    bucket: config.qiniu.bucket,
    domain: config.qiniu.domain
});

exports.client = client;

exports.getUploadToken = function(req, res) {
    return res.send(client.uploadToken());
};
