var Quote = require('../models').Quote;

exports.getQuotes = function (req, res) {
  Quote
    .find()
    .limit(20)
    .exec(function (err, quotes) {
      return res.send(quotes);
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

  Quote
    .findById(quoteId, function (err, quote) {
      return res.send(quote);
    });
};

exports.getQuotesByCharacterId = function (req, res) {
  var characterId = req.params.characterId;
  var paginationId = req.query.paginationId;
  var perPage = 4;
  var currentPage = parseInt(req.query.currentPage);
  var page = parseInt(req.query.page);

  Quote
    .count({character_id: characterId})
    .exec(function (err, count) {

      if (!paginationId || page === 1) {
        Quote
          .find({
            character_id: characterId
          })
          .sort({_id: 1})
          .limit(perPage)
          .exec(function (err, quotes) {
            return res.send({
              total: count,
              quotes: quotes,
              perPage: perPage
            });
          });

        // 从其他页面返回列表页面
        } else if (currentPage === page) {
          Quote
            .find({
              character_id: characterId,
              _id: {
                $gte: paginationId
              }
            })
            .sort({_id: 1})
            .limit(perPage)
            .exec(function (err, quotes) {
              return res.send({
                total: count,
                quotes: quotes,
                perPage: perPage
              });
            });

        // 向后翻页
        } else if (currentPage < page) {
          Quote
            .find({
              character_id: characterId,
              _id: {
                $gt: paginationId
              }
            })
            .sort({_id: 1})
            .skip((page - currentPage - 1) * perPage + (perPage - 1))
            .limit(perPage)
            .exec(function (err, quotes) {
              return res.send({
                total: count,
                quotes: quotes,
                perPage: perPage
              });
            });

        // 向前翻页
        } else {
          Quote
            .find({
              character_id: characterId,
              _id: {
                $lt: paginationId
              }
            })
            .sort({_id: 1})
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec(function (err, quotes) {
              return res.send({
                total: count,
                quotes: quotes,
                perPage: perPage
              });
            });
        }
    });
};