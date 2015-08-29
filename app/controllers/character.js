var Character = require('../models').Character;
var Source = require('../models').Source;
var User = require('../models').User;
var utils = require('./utils');
var qiniuClient = require('../utils/qiniu').client;
var async = require('async');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var perPage = config.perPage;

exports.checkCharacter = function(req, res) {
    var name = req.query.name;
    var alias = req.query.alias || [''];
    var sourceId = req.query.sourceId;

    if (typeof alias === 'string') {
        alias = Array(alias);
    }

    Character
        .findOne({
            sourceId: sourceId,
            $or: [{
                name: name
            }, {
                alias: {
                    $in: alias
                }
            }]
        })
        .exec(function(err, character) {
            if (character) {
                return res.send({
                    exist: true
                });
            } else {
                return res.send({
                    exist: false
                });
            }
        });
};

exports.getCharacters = function(req, res) {
    var page = req.query.page || 1;
    var limit = req.query.perPage || perPage;

    Character.paginate({}, {
        page: page,
        limit: limit,
        sortBy: {
            updatedAt: -1,
            viewsCount: -1,
            likersCount: -1,
            quotesCount: -1
        }
    }, function(err, characters) {
        return res.send({
            objects: characters
        });
    });
};

exports.postCharacter = function(req, res) {
    var obj = {
        name: req.body.name,
        alias: req.body.alias,
        info: req.body.info,
        sourceId: req.body.sourceId,
        contributorId: req.user._id,
        avatar: req.body.avatar
    };

    var character = new Character(obj);
    character.save(function(err, character) {

        Source.findByIdAndUpdate(character.sourceId, {
            $inc: {
                charactersCount: 1
            }
        }, function(err) {

            return res.send(character);

        });
    });
};

exports.getCharacterById = function(req, res) {
    var characterId = req.params.characterId;

    if (req.query.with_source) {
        async.waterfall([
            function(callback) {
                Character
                    .findById(characterId)
                    .lean()
                    .exec(function(err, character) {
                        callback(null, character);
                    });
            },
            function(character, callback) {
                Source
                    .findById(character.sourceId)
                    .lean()
                    .exec(function(err, source) {
                        callback(null, character, source);
                    });
            },
            function(character, source, callback) {
                User
                    .findById(character.contributorId)
                    .lean()
                    .exec(function(err, user) {
                        callback(null, character, source, user);
                    });
            }
        ], function(err, character, source, user) {
            delete character.sourceId;
            delete character.contributorId;
            character.source = source;
            character.contributor = user;
            return res.send(character);
        });
    } else {
        Character
            .findById(characterId)
            .lean()
            .exec(function(err, character) {
                delete character.sourceId;
                delete character.contributorId;
                return res.send(character);
            });
    }
};

exports.putCharacterById = function(req, res) {
    var characterId = req.params.characterId;
    var update = {
        name: req.body.name,
        alias: req.body.alias || [],
        info: req.body.info || '',
        sourceId: req.body.sourceId,
        avatar: req.body.avatar || '',
        updatedAt: new Date()
    };

    Character
        .findById(characterId, function(err, character) {

            if (update.avatar !== '' && update.avatar.localeCompare(character.avatar) !== 0) {
                qiniuClient.delete(character.avatar, function(err) {
                    console.log('qiniu client error');
                    console.log(err);
                });
            }

            Character
                .findByIdAndUpdate(characterId, update, function(err, character) {
                    return res.send(character);
                });
        });
};

exports.getCharactersByKeyword = function(req, res) {
    var keyword = req.query.keyword;
    var page = req.query.page || 1;
    var limit = req.query.perPage || perPage;

    var keywordReg = new RegExp('.*' + keyword + '.*');

    Character
        .paginate({
            $or: [
                { name: keywordReg },
                {
                    alias: {
                        $in: [ keywordReg ]
                    }
                }
            ]
        }, {
            page: page,
            limit: limit
        }, function(err, characters) {
            return res.send({
                objects: characters
            });
        });
};

exports.getCharactersBySourceId = function(req, res) {
    var sourceId = req.params.sourceId;
    var page = req.query.page || 1;
    var limit = req.query.perPage || perPage;

    Character.paginate({
        sourceId: sourceId
    }, {
        page: page,
        limit: limit
    }, function(err, characters) {

        Source.update({
            _id: sourceId
        }, {

            $inc: {
                viewsCount: 1
            }

        }, function(err, source) {

            return res.send({
                objects: characters
            });

        });
    });

};
