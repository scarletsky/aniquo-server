var Source = require('../models').Source;
var Quote = require('../models').Quote;
var utils = require('./utils');
var async = require('async');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var perPage = config.perPage;

exports.checkSource = function (req, res) {
    var name = req.query.name;
    var alias = req.query.alias || [''];

    if (typeof alias === 'string') {
        alias = Array(alias);
    }

    var query = {
        $or: [
            {name: name},
            {alias: {
                $in: alias
            }}
        ]
    }

    Source
        .findOne(query)
        .exec(function (err, source) {
            if (source) {
                return res.send({exist: true});
            } else {
                return res.send({exist: false});
            }
        });
};

exports.getSources = function (req, res) {
    var page = req.query.page || 1;
    var limit = req.query.perPage || perPage;

    Source.paginate({}, {page: page, limit: limit}, function (err, sources) {
        return res.send({objects: sources});
    });
    
};

exports.postSource = function (req, res) {
    var obj = {
        name: req.body.name,
        alias: req.body.alias,
        info: req.body.info,
        contributorId: req.user._id,
        cover: req.body.cover
    };

    var source = new Source(obj);
    source.save(function (err, source) {
        return res.send(source);
    });
};

exports.getSourceById = function (req, res) {
    var sourceId = req.params.sourceId;

    Source
        .findById(sourceId, function (err, source) {
            return res.send(source);
        });
};

exports.putSourceById = function (req, res) {
    var sourceId = req.params.sourceId;
    var obj = {
        name: req.body.name,
        alias: req.body.alias || [],
        info: req.body.info || '',
        cover: req.body.cover || ''
    };

    Source
        .findByIdAndUpdate(sourceId, obj, function (err, source) {
            return res.send(source);
        });
};

exports.getSourcesByKeyword = function (req, res) {
    var keyword = req.query.kw;
    var page = req.query.page || 1;
    var size = req.query.perPage || perPage;

    var keywordReg = new RegExp('.*' + keyword + '.*');

    Source
        .find({
            name: keywordReg
        })
        .lean()
        .exec(function (err, sources) {
            return res.send(sources);
        });
};
