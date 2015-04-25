var Quote = require('../models').Quote;
var Character = require('../models').Character;
var User = require('../models').User;
var utils = require('./utils');
var async = require('async');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var perPage = config.perPage;

exports.getQuotes = function (req, res) {
    var page = req.query.page || 1;
    var size = req.query.perPage || perPage;

    Quote.paginate({}, page, size, function (err, pageCount, quotes, total) {

        async.mapSeries(quotes, function (q, callback) {

            Character
                .find({
                    _id: {
                        $in: q.characterIds
                    }
                })
                .exec(function (err, characters) {

                    q.characters = characters;
                    delete q.characterIds;
                    callback(null, q);

                });

        }, function (err, qs) {

            var results = {
                pageCount: pageCount,
                objects: quotes,
                total: total 
            }

            return res.send(results);

        })
    }, {
        lean: true
    });

};

exports.postQuote = function (req, res) {
    var obj = {
        characterIds: req.body.characterIds,
        quote: req.body.quote,
        reference: req.body.reference,
        contributorId: req.user._id,
        scene: req.body.scene
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
    var withCharacterAll = req.query.with_character_all;
    var withContributor = req.query.with_contributor; 

    if (withCharacterAll || withContributor) {
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
                if (withCharacterAll) {
                    Character
                        .find({
                            _id: {
                                $in: quote.characterIds
                            }
                        })
                        .exec(function (err, characters) {
                            callback(null, quote, characters)
                        })
                } else {
                    callback(null, quote, null);
                }
            },
            function (quote, characters, callback) {
                if (withContributor) {
                    User
                        .findById(quote.contributorId, '-passwordHash')
                        .lean()
                        .exec(function (err, contributor) {
                            callback(null, quote, characters, contributor);
                        });
                } else {
                    callback(null, quote, characters, null);
                }
            }
        ], function (err, quote, characters, contributor) {
            delete quote.characterIds;
            delete quote.contributorId;

            if (characters) {
                quote.characters = characters;
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
        characterIds: req.body.characterIds,
        quote: req.body.quote,
        reference: req.body.reference || '',
        scene: req.body.scene || ''
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

    Quote.paginate({
        characterIds: {
            $in: [characterId]
        }
    }, page, size, function (err, pageCount, quotes, total) {

        async.mapSeries(quotes, function (q, callback) {

            Character
                .find({
                    _id: {
                        $in: q.characterIds
                    }
                })
                .exec(function (err, characters) {

                    q.characters = characters;
                    delete q.characterIds;
                    callback(null, q);

                });

        }, function (err, qs) {

            var results = {
                pageCount: pageCount,
                objects: quotes,
                total: total 
            }

            return res.send(results);

        })
    }, {
        lean: true
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
