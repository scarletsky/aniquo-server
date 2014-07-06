var Quote = require('../models').Quote;
var Character = require('../models').Character;
var utils = require('./utils');
var async = require('async');

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
    characterId: req.param('characterId'),
    quote: req.param('quote'),
    reference: req.param('reference')
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
  var quoteId = req.params.quoteId;

  if (req.query.with_character) {
    async.waterfall([
      function (callback) {
        Quote
          .findById(quoteId)
          .lean()
          .exec(function (err, quote) {
            callback(null, quote);
          });
      },
      function (quote, callback) {
        Character
          .findById(quote.characterId)
          .lean()
          .exec(function (err, character) {
            callback(null, quote, character);
          });
      }
    ], function (err, quote, character) {
      delete quote.characterId;
      quote.character = character;
      return res.send(quote)
    });
  } else {
    Quote
      .findById(quoteId, function (err, quote) {
        return res.send(quote);
      });
  }
};

exports.putQuoteById = function (req, res) {
  var quoteId =req.params.quoteId;
  var obj = {
    characterId: req.param('characterId'),
    quote: req.param('quote'),
    reference: req.param('reference')
  };

  Quote
    .findByIdAndUpdate(quoteId, obj, function (err, quote) {
      return res.send(quote);
    });
};

exports.getQuotesByCharacterId = function (req, res) {
  var characterId = req.params.characterId;
  var paginationId = req.query.paginationId;

  var options = {
    targetCriteria: {
      characterId: characterId
    },
    nextPageCriteria: {
      characterId: characterId,
      _id: {
        $gt: paginationId
      }
    },
    prevPageCriteria: {
      characterId: characterId,
      _id: {
        $lt: paginationId
      }
    },
    otherPageCriteria: {
      characterId: characterId,
      _id: {
        $gte: paginationId
      }
    }
  };

  return utils.paging(req, res, Quote, options);
};
