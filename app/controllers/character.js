var Character = require('../models').Character;
var utils = require('./utils');

exports.checkCharacter = function (req, res) {
  var name = req.query.name;
  var nickname = req.query.nickname ? req.query.nickname.split(',') : [];
  var sourceId = req.query.sourceId;

  Character
    .findOne({
      source_id: sourceId,
      $or: [
        {name: name},
        {nickname: {
          $in: nickname
        }}
      ]
    })
    .exec(function (err, character) {
      if (character) {
        return res.send({exist: true});
      } else {
        return res.send({exist: false});
      }
    });
};

exports.getCharacters = function (req, res) {
  Character
    .find()
    .limit(20)
    .exec(function (err, characters) {
      return res.send(characters);
    });
};

exports.postCharacter = function (req, res) {
  var obj = {
    name: req.param('name'),
    nickname: req.param('nickname') ? req.param('nickname').split(',') : [],
    info: req.param('info') || '',
    source_id: req.param('sourceId')
  };

  var character = new Character(obj);
  character.save(function (err, character) {
    return res.send(character);
  });
};

exports.getCharacterById = function (req, res) {
  var characterId = req.params.characterId;

  Character
    .findById(characterId, function (err, character) {
      return res.send(character);
    });
};

exports.putCharacterById = function (req, res) {
  var characterId = req.params.characterId;
  var obj = {
    name: req.param('name'),
    nickname: req.param('nickname') || [],
    info: req.param('info'),
    source_id: req.param('sourceId')
  };

  Character
    .findByIdAndUpdate(characterId, obj, function (err, character) {
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