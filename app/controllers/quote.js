var Quote = require('../models').Quote;
var Character = require('../models').Character;
var User = require('../models').User;
var utils = require('./utils');
var async = require('async');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var perPage = config.perPage;

exports.getQuotes = function (req, res) {
  Quote
    .find()
    .limit(20)
    .exec(function (err, quotes) {
      return res.send(quotes);
    });
};

exports.postQuote = function (req, res) {
  var obj = {
    characterIds: req.param('characterId'),
    quote: req.param('quote'),
    reference: req.param('reference'),
    contributorId: req.user._id,
    scene: req.param('scene')
  };

  var quote = new Quote(obj);
  quote.save(function (err, quote) {
    return res.send(quote);
  });
};

exports.getQuoteByKeyword = function (req, res) {
  var keyword = req.query.kw;

  Quote
    .find({quote: new RegExp('(.*)' + keyword + '(.*)')})
    .limit(20)
    .exec(function (err, quotes) {
      return res.send(quotes);
    });
};

exports.getQuoteById = function (req, res) {
  var userId = req.user ? req.user._id : undefined;
  var quoteId = req.params.quoteId;

  var withCharacter = req.query.with_character;
  var withContributor = req.query.with_contributor; 

  if (withCharacter || withContributor) {
    async.waterfall([
      function (callback) {
        Quote
          .findByIdAndUpdate(quoteId, {
            $inc: {
              viewCount: 1
            }
          })
          .lean()
          .exec(function (err, quote) {
            callback(null, quote);
          });
      },
      function (quote, callback) {
        if (withCharacter) {
          var characterId = req.query.characterId || quote.characterIds[
            Math.floor(Math.random() * quote.characterIds.length)
          ];
          Character
            .findById(characterId)
            .lean()
            .exec(function (err, character) {
              callback(null, quote, character);
            });
        } else {
          callback(null, quote, null);
        }
      },
      function (quote, character, callback) {
        if (withContributor) {
          User
            .findById(quote.contributorId, '-passwordHash')
            .lean()
            .exec(function (err, contributor) {
              callback(null, quote, character, contributor);
            });
        } else {
          callback(null, quote, character, null);
        }
      }
    ], function (err, quote, character, contributor) {
      delete quote.characterIds;
      delete quote.contributorId;

      if (character) {
        quote.character = character;
      }

      if (contributor) {
        quote.contributor = contributor;
      }

      quote = utils.setLikedField(quote, userId);

      return res.send(quote);
    });
  } else {
    Quote
      .findByIdAndUpdate(quoteId, {$inc: {viewCount: 1}}, function (err, quote) {

        quote = utils.setLikedField(quote, userId);

        return res.send(quote);
      });
  }
};

exports.putQuoteById = function (req, res) {
  var quoteId =req.params.quoteId;
  var obj = {
    characterIds: req.param('characterId'),
    quote: req.param('quote'),
    reference: req.param('reference'),
    scene: req.param('scene')
  };

  Quote
    .findByIdAndUpdate(quoteId, obj, function (err, quote) {
      return res.send(quote);
    });
};

exports.getQuotesByCharacterId = function (req, res) {
  var characterId = req.params.characterId;
  var page = req.query.page || 1;
  var size = req.query.perPage || perPage;

  Quote.search({
    sort: [
      {
        createdAt: {
          order: 'asc'
        }
      }
    ],
    filter: {
      term: {
        characterIds: characterId
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
      Quote
        .find({
          _id: {
            $in: ids
          }
        })
        .exec(function (err, quotes) {

          return res.send({
            total: total,
            perPage: perPage,
            objects: quotes 
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

exports.getQuotesByUserId = function (req, res) {
  var userId = req.user._id;
  var page = req.query.page || 1;
  var size = req.query.perPage || perPage;

  Quote.search({
    sort: [
      {
        createdAt: {
          order: 'asc'
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
      Quote
        .find({
          _id: {
            $in: ids
          }
        })
        .exec(function (err, quotes) {

          return res.send({
            total: total,
            perPage: perPage,
            objects: quotes 
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

exports.putQuoteLikerIdById = function (req, res) {
  var userId = req.user._id;
  var quoteId = req.params.quoteId;

  Quote
    .findById(quoteId)
    .exec(function (err, quote) {

      if (quote.likerIds.indexOf(userId) === -1) {
        quote.likerIds.unshift(userId);
        quote.likeCount++;
        quote.save(function (err, quote) {
          quote = utils.setLikedField(quote, userId);
          return res.send(quote);
        });
      } else {
        quote = utils.setLikedField(quote, userId);
        return res.send(quote);
      }

    });
};

exports.deleteQuoteLikerIdById = function (req, res) {
  var userId = req.user._id;
  var quoteId = req.params.quoteId;

  Quote
    .findById(quoteId)
    .exec(function (err, quote) {

      if (quote.likerIds.indexOf(userId) !== -1) {
        quote.likerIds.pull(userId);
        quote.likeCount--;
        quote.save(function (err, quote) {
          quote = utils.setLikedField(quote, userId);
          return res.send(quote);
        });
      } else {
        quote = utils.setLikedField(quote, userId);
        return res.send(quote);
      }

    });
};
