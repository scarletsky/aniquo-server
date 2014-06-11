var Character = require('../models').Character;

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

  Character
    .find({source_id: sourceId})
    .limit(10)
    .exec(function (err, characters) {
      return res.send(characters);
    });
};