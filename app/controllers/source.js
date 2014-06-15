var Source = require('../models').Source;

exports.getSources = function (req, res) {
  Source
    .find()
    .limit(20)
    .exec(function (err, sources) {
      return res.send(sources);
    });
};

exports.getSourceById = function (req, res) {
  var sourceId = req.params.sourceId;

  Source
    .findById(sourceId, function (err, user) {
      return res.send(user);
    });
};

exports.getSourcesByKeyword = function (req, res) {
  var keyword = req.query.kw;
  var regexpKeyword = new RegExp('.*' + keyword + '.*');

  Source
    .find({
      $or: [
        {name: regexpKeyword},
        {alias: regexpKeyword}
      ]
    })
    .exec(function (err, sources) {
      return res.send(sources);
    });
};
