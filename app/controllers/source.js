var Source = require('../models').Source;
var Quote = require('../models').Quote;
var utils = require('./utils');
var async = require('async');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var perPage = config.perPage;

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
  var page = req.query.page || 1;
  var limit = req.query.perPage || perPage;

  Source.paginate({}, page, limit, function (err, pageCount, sources, total) {

    var results = {
      pageCount: pageCount,
      objects: sources,
      total: total 
    }

    return res.send(results);
  });
  
};

exports.postSource = function (req, res) {
  var obj = {
    name: req.body.name,
    alias: req.body.alias,
    info: req.body.info,
    contributorId: req.user._id,
    cover: req.body.cover
  };

  var source = new Source(obj);
  source.save(function (err, source) {
    return res.send(source);
  });
};

exports.getSourceById = function (req, res) {
  var sourceId = req.params.sourceId;

  Source
    .findById(sourceId, function (err, source) {
      return res.send(source);
    });
};

exports.putSourceById = function (req, res) {
  var sourceId = req.params.sourceId;
  var obj = {
    name: req.body.name,
    alias: req.body.alias || [],
    info: req.body.info || '',
    cover: req.body.cover || ''
  };

  Source
    .findByIdAndUpdate(sourceId, obj, function (err, source) {
      return res.send(source);
    });
};

exports.getSourcesByKeyword = function (req, res) {
  var keyword = req.query.kw;
  var page = req.query.page || 1;
  var size = req.query.perPage || perPage;

  Source.search({
    sort: [
      {
        createdAt: {
          order: 'desc'
        }
      },
      '_score'
    ],
    query: {
      multi_match: {
        query: keyword,
        fields: ['name', 'alias']
      }
    },
    fields: [],
    from: (page - 1) * size,
    size: size
  }, function (err, _results) {
    var output = [];
    var total = _results.hits.total;
    var results = _results.hits.hits;

    if (results.length > 0) {
      var ids = results.map(function (r) { return r._id; });
      Source
        .find({
          _id: {
            $in: ids
          }
        })
        .sort({
          createdAt: -1
        })
        .exec(function (err, sources) {

          return res.send({
            total: total,
            perPage: perPage,
            objects: sources
          });

        });
    } else {

      return res.send({
        total: total,
        perPage: perPage,
        objects: []
      });

    }

  });
};

exports.getSourcesByUserId = function (req, res) {
  var userId = req.user._id;
  var page = req.query.page || 1;
  var size = req.query.perPage || perPage;

  Source.search({
    sort: [
      {
        createdAt: {
          order: 'desc'
        }
      }
    ],
    query: {
      term: {
        contributorId: userId
      }
    },
    fields: [],
    from: (page - 1) * size,
    size: size
  }, function (err, _results) {
    var output = [];
    var total = _results.hits.total;
    var results = _results.hits.hits;

    if (results.length > 0) {
      var ids = results.map(function (r) { return r._id; });
      Source
        .find({
          _id: {
            $in: ids
          }
        })
        .sort({
          createdAt: -1
        })
        .exec(function (err, sources) {

          return res.send({
            total: total,
            perPage: perPage,
            objects: sources
          });

        });
    } else {

      return res.send({
        total: total,
        perPage: perPage,
        objects: []
      });

    }

  });

};
