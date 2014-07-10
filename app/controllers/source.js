var Source = require('../models').Source;

exports.checkSource = function (req, res) {
  var name = req.query.name;
  var alias = req.query.alias || [''];

  if (typeof alias === 'string') {
    alias = Array(alias);
  }

  Source
    .findOne({
      $or: [
        {name: name},
        {alias: {
          $in: alias
        }}
      ]
    })
    .exec(function (err, source) {
      if (source) {
        return res.send({exist: true});
      } else {
        return res.send({exist: false});
      }
    });
};

exports.getSources = function (req, res) {
  Source
    .find()
    .limit(20)
    .exec(function (err, sources) {
      return res.send(sources);
    });
};

exports.postSource = function (req, res) {
  var obj = {
    name: req.param('name'),
    alias: req.param('alias'),
    info: req.param('info')
  };

  var source = new Source(obj);
  source.save(function (err, source) {
    return res.send(source);
  });
};

exports.getSourceById = function (req, res) {
  var sourceId = req.params.sourceId;

  Source
    .findById(sourceId, function (err, user) {
      return res.send(user);
    });
};

exports.putSourceById = function (req, res) {
  var sourceId = req.params.sourceId;
  var obj = {
    name: req.param('name'),
    alias: req.param('alias'),
    info: req.param('info')
  };

  Source
    .findByIdAndUpdate(sourceId, obj, function (err, source) {
      return res.send(source);
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
