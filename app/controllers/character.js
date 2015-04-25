var Character = require('../models').Character;
var Source = require('../models').Source;
var utils = require('./utils');
var async = require('async');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var perPage = config.perPage;

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
  var page = req.query.page || 1;
  var limit = req.query.perPage || perPage;

  Character.paginate({}, page, limit, function (err, pageCount, characters, total) {

    var results = {
      pageCount: pageCount,
      objects: characters,
      total: total 
    }

    return res.send(results);
  });
};

exports.postCharacter = function (req, res) {
  var obj = {
    name: req.body.name,
    alias: req.body.alias,
    info: req.body.info,
    sourceId: req.body.sourceId,
    contributorId: req.user._id,
    avatar: req.body.avatar
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
      delete character.contributorId;
      character.source = source;
      return res.send(character);
    });
  } else {
    Character
      .findById(characterId)
      .lean()
      .exec(function (err, character) {
        delete character.sourceId;
        delete character.contributorId;
        return res.send(character);
      });
  }
};

exports.putCharacterById = function (req, res) {
  var characterId = req.params.characterId;
  var obj = {
    name: req.body.name,
    alias: req.body.alias || [],
    info: req.body.info || '',
    sourceId: req.body.sourceId,
    avatar: req.body.avatar || ''
  };

  Character
    .findByIdAndUpdate(characterId, obj, function (err, character) {
      return res.send(character);
    });
};

exports.getCharactersByKeyword = function (req, res) {
  var keyword = req.query.kw;
  var page = req.query.page || 1;
  var size = req.query.perPage || perPage;

  var keywordReg = new RegExp('.*' + keyword + '.*');

  Character
    .find({
      name: keywordReg
    })
    .lean()
    .exec(function (err, characters) {
      return res.send(characters);
    });
};

exports.getCharactersBySourceId = function (req, res) {
  var sourceId = req.params.sourceId;
  var page = req.query.page || 1;
  var limit = req.query.perPage || perPage;

  Character.paginate({sourceId: sourceId}, page, limit, function (err, pageCount, characters, total) {

    var results = {
      pageCount: pageCount,
      objects: characters,
      total: total 
    }

    return res.send(results);
  });

};
