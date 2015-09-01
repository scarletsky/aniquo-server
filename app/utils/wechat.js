var Router = require('express').Router;
var wechat = require('wechat');
var request = require('request');
var Source = require('../models').Source;
var Character = require('../models').Character;
var Quote = require('../models').Quote;
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var router = new Router();

router
    .use('/wechat', wechat(config.wechat, function(req, res, next) {
        var message = req.weixin;


        if (message.MsgType === 'text') {
            var options = {
                model: null,
                query: {},
                limit: 5
            };
            switch (message.Content) {
                case 'rs':
                    options.model = Source;
                    options.sort = '-viewsCount';
                    listResources(req, res, options);
                    break;

                case 'ls':
                    options.model = Source;
                    options.sort = '-createdAt';
                    listResources(req, res, options);
                    break;

                case 'rc':
                    options.model = Character;
                    options.sort = '-viewsCount';
                    listResources(req, res, options);
                    break;

                case 'lc':
                    options.model = Character;
                    options.sort = '-createdAt';
                    listResources(req, res, options);
                    break;

                case 'rq':
                    getQuote(req, res, options);
                    break;

                case 'lq':
                    options.sort = '-createdAt';
                    getQuote(req, res, options);
                    break;

                default:
                    res.reply('还没做好');
            }

        } else {
            res.reply('啥都没有');
        }
    }));

function listResources(req, res, options) {
    options.model
        .find(options.query)
        .limit(options.limit)
        .sort(options.sort)
        .lean()
        .exec(function(err, _results) {
            var results = _results.map(function(s, i) {
                return (i + 1) + ' ' + s.name;
            });

            res.reply(results.join('\n'))
        });
}

function getQuote(req, res, options) {
    Quote.count({}, function(err, count) {

        var random = Math.floor(Math.random() * count);

        var query = Quote.findOne({});

        if (options.sort) {
            query.sort(options.sort).limit(1);
        } else {
            query.skip(random).limit(1);
        }

        query
            .lean()
            .exec(function(err, quote) {
                res.reply(quote.quote);
            });

    });
}

exports.router = router;
