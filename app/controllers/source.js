var Source = require('../models').Source;
var Quote = require('../models').Quote;
var User = require('../models').User;
var utils = require('./utils');
var qiniuClient = require('../utils/qiniu').client;
var async = require('async');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var perPage = config.perPage;

exports.checkSource = function(req, res) {
    var name = req.query.name;
    var alias = req.query.alias || [''];

    if (typeof alias === 'string') {
        alias = Array(alias);
    }

    var query = {
        $or: [{
            name: name
        }, {
            alias: {
                $in: alias
            }
        }]
    };

    Source
        .findOne(query)
        .exec(function(err, source) {
            if (source) {
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

exports.getSources = function(req, res) {
    var page = req.query.page || 1;
    var limit = req.query.perPage || perPage;

    Source.paginate({}, {
        page: page,
        limit: limit,
        sortBy: {
            updatedAt: -1,
            viewsCount: -1,
            charactersCount: -1,
            quotesCount: -1
        }
    }, function(err, sources) {
        return res.send({
            objects: sources
        });
    });

};

exports.postSource = function(req, res) {
    var obj = {
        name: req.body.name,
        alias: req.body.alias,
        info: req.body.info,
        contributorId: req.user._id,
        cover: req.body.cover,
        viewsCount: Math.ceil(Math.random() * 10) * Math.ceil(Math.random() * 10)
    };

    var source = new Source(obj);
    source.save(function(err, source) {
        return res.send(source);
    });
};

exports.getSourceById = function(req, res) {
    var sourceId = req.params.sourceId;

    async.waterfall([
        function(callback) {
            Source
                .findByIdAndUpdate(sourceId, {
                    $inc: {
                        viewsCount: 1
                    }
                })
                .lean()
                .exec(function(err, source) {

                    callback(null, source);
                });
        },
        function(source, callback) {
            User
                .findById(source.contributorId)
                .lean()
                .exec(function(err, user) {
                    callback(null, source, user);
                });
        }
    ], function(err, source, user) {
        delete source.contributorId;
        source.contributor = user;
        return res.send(source);
    });
};

exports.putSourceById = function(req, res) {
    var sourceId = req.params.sourceId;
    var update = {
        name: req.body.name,
        alias: req.body.alias || [],
        info: req.body.info || '',
        cover: req.body.cover || '',
        updatedAt: new Date()
    };

    Source
        .findById(sourceId, function(err, source) {

            if (update.cover !== '' && update.cover.localeCompare(source.cover) !== 0) {
                qiniuClient.delete(source.cover, function(err) {
                    console.log('qiniu client error');
                    console.log(err);
                });
            }

            Source.findByIdAndUpdate(sourceId, update, {new: true}, function(err, source) {
                return res.send(source);
            });
        });

};

exports.getSourcesByKeyword = function(req, res) {
    var keyword = req.query.keyword;
    var page = req.query.page || 1;
    var limit = req.query.perPage || perPage;

    var keywordReg = new RegExp('.*' + keyword + '.*');

    Source
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
        }, function(err, sources) {
            return res.send({
                objects: sources
            });
        });
};
