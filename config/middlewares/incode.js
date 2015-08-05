var crypto = require('crypto');
var request = require('request');
var env = process.env.NODE_ENV || 'development';
var config = require('../config')[env];

module.exports = function (req, res, next) {
  var incode = req.body.incode;

  if (!incode) {
    return res.status(403).send({error: '邀请码不能为空'});
  }

  var md5 = crypto.createHash('md5');
  var sign = md5.update(config.incode.APISecret + incode).digest('hex');

  request({
    method: 'PUT',
    url: config.incode.occupy,
    json: true,
    qs: {
      sign: sign,
      api_key: config.incode.APIKey,
      code: incode
    }
  }, function (err, response, body) {

    if (err) {
      return res.status(500).send({error: '网络错误，请稍候再试'});
    }

    if (body.error_code === 0) {
      next();
    } else {
      console.log(body);
      return res.status(403).send({error: '邀请码无效'});
    }

  });

};
