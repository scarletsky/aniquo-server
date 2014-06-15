var Character = require('../models').Character;
var utils = require('./utils');

exports.getCharacters = function (req, res) {
  Character
    .find()
    .limit(20)
    .exec(function (err, characters) {
      return res.send(characters);
    });
};

exports.getCharacterById = function (req, res) {
  var characterId = req.params.characterId;

  Character
    .findById(characterId, function (err, character) {
      return res.send(character);
    });
};

exports.getCharactersByKeyword = function (req, res) {
  var keyword = req.query.kw;
  var regexpKeyword = new RegExp('.*' + keyword + '.*');

  Character
    .find({
      $or: [
        {name: regexpKeyword},
        {nickname: regexpKeyword}
      ]
    })
    .exec(function (err, characters) {
      return res.send(characters);
    });
};

exports.getCharactersBySourceId = function (req, res) {
  var sourceId = req.params.sourceId;
  var paginationId = req.query.paginationId;

  var options = {
    targetCriteria: {
      source_id: sourceId 
    },
    nextPageCriteria: {
      source_id: sourceId,
      _id: {
        $gt: paginationId
      }
    },
    prevPageCriteria: {
      source_id: sourceId,
      _id: {
        $lt: paginationId
      }
    },
    otherPageCriteria: {
      source_id: sourceId,
      _id: {
        $gte: paginationId
      }
    }
  };

  return utils.paging(req, res, Character, options);
};