var user = require('./user');
var source = require('./source');
var character = require('./character');
var quote = require('./quote');

exports.search = function (req, res) {
  var type = req.query.t || 'all';

  switch (type) {
    case 'user':
      user.getUsersByKeyword(req, res);
      break;

    case 'source':
      source.getSourcesByKeyword(req, res);
      break;

    case 'character':
      character.getCharactersByKeyword(req, res);
      break;

    case 'quote':
      quote.getQuoteByKeyword(req, res);
      break;

    default:
      res.send([]);
  }
};