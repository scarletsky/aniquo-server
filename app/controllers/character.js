var Character = require('../models').Character;
var Source = require('../models').Source;
var utils = require('./utils');
var async = require('async');

exports.checkCharacter = function (req, res) {
  var name = req.query.name;
  var alias = req.query.alias || [''];
  var sourceId = req.query.sourceId;

  if (typeof alias === 'string') {
    alias = Array(alias);
  }

  Character
    .findOne({
      sourceId: sourceId,
      $or: [
        {name: name},
        {alias: {
          $in: alias
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
    alias: req.param('alias'),
    info: req.param('info'),
    sourceId: req.param('sourceId')
  };

  var character = new Character(obj);
  character.save(function (err, character) {
    return res.send(character);
  });
};

exports.getCharacterById = function (req, res) {
  var characterId = req.params.characterId;

  if (req.query.with_source) {
    async.waterfall([
      function (callback) {
        Character
          .findById(characterId)
          .lean()
          .exec(function (err, character) {
            callback(null, character);
          });
      },
      function (character, callback) {
        Source
          .findById(character.sourceId)
          .lean()
          .exec(function (err, source) {
            callback(null, character, source);
          });
      }
    ], function (err, character, source) {
      delete character.sourceId;
      character.source = source;
      return res.send(character);
    });
  } else {
    Character
      .findById(characterId, function (err, character) {
        return res.send(character);
      });
  }
};

exports.putCharacterById = function (req, res) {
  var characterId = req.params.characterId;
  var obj = {
    name: req.param('name'),
    alias: req.param('alias') || [],
    info: req.param('info'),
    sourceId: req.param('sourceId')
  };

  Character
    .findByIdAndUpdate(characterId, obj, function (err, character) {
      return res.send(character);
    });
};

exports.getCharactersByKeyword = function (req, res) {
  var keyword = req.query.kw;
  var regexpKeyword = new RegExp('.*' + keyword + '.*');

  if (req.query.with_source) {
    async.waterfall([
      function (callback) {
        Character
          .find({
            $or: [
              {name: regexpKeyword},
              {alias: regexpKeyword}
            ]
          })
          .lean()
          .exec(function (err, characters) {
            callback(null, characters);
          });
      },
      function (characters, callback) {
        if (characters.length > 0) {
          var charactersWithSource = [];
          async.eachSeries(characters, function (character, callback) {
            Source
              .findById(character.sourceId)
              .lean()
              .exec(function (err, source) {
                delete character.sourceId;
                character.source = source;
                charactersWithSource.push(character);
                callback();
              });
          }, function (err) {
            callback(null, charactersWithSource);
          });
        } else {
          callback(null, []);
        }
      }
    ], function (err, characters) {
      return res.send(characters);
    });

  } else {
    Character
      .find({
        $or: [
          {name: regexpKeyword},
          {alias: regexpKeyword}
        ]
      })
      .exec(function (err, characters) {
        return res.send(characters);
      });
  }
};

exports.getCharactersBySourceId = function (req, res) {
  var sourceId = req.params.sourceId;
  var paginationId = req.query.paginationId;

  var options = {
    targetCriteria: {
      sourceId: sourceId 
    },
    nextPageCriteria: {
      sourceId: sourceId,
      _id: {
        $gt: paginationId
      }
    },
    prevPageCriteria: {
      sourceId: sourceId,
      _id: {
        $lt: paginationId
      }
    },
    otherPageCriteria: {
      sourceId: sourceId,
      _id: {
        $gte: paginationId
      }
    }
  };

  return utils.paging(req, res, Character, options);
};

exports.getCharactersByUserId = function (req, res) {
  var userId = req.user._id;
  var paginationId = req.query.paginationId;

  var options = {
    targetCriteria: {
      contributorId: userId
    },
    nextPageCriteria: {
      contributorId: userId,
      _id: {
        $gt: paginationId
      }
    },
    prevPageCriteria: {
      contributorId: userId,
      _id: {
        $lt: paginationId
      }
    },
    otherPageCriteria: {
      contributorId: userId,
      _id: {
        $gte: paginationId
      }
    }
  };

  return utils.paging(req, res, Character, options);
};
