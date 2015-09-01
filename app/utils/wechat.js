var Router = require('express').Router;
var wechat = require('wechat');
var request = require('request');
var Source = require('../models').Source;
var Character = require('../models').Character;
var Quote = require('../models').Quote;
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var router = new Router();

if (process.env.WX_ACCESS_TOKEN) {

    request(
    {
        method: 'POST',
        url: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' +
             process.env.WX_ACCESS_TOKEN,
        body: config.wechat.menus,
        json: true
    }, function(err, res, body) {
        console.log(err);
        console.log(body);
    });
}

router
    .use('/wechat', wechat(config.wechat, function(req, res, next) {
        var message = req.weixin;

        if (message.MsgType === 'event') {
            var options = {
                model: null,
                query: {},
                limit: 5
            };
            switch (message.EventKey) {
                case 'GET_RANDOM_SOURCE':
                    options.model = Source;
                    options.sort = '-viewsCount';
                    listResources(req, res, options);
                    break;

                case 'GET_LATEST_SOURCES':
                    options.model = Source;
                    options.sort = '-createdAt';
                    listResources(req, res, options);
                    break;

                case 'GET_RANDOM_CHARACTER':
                    options.model = Character;
                    options.sort = '-viewsCount';
                    listResources(req, res, options);
                    break;

                case 'GET_LATEST_CHARACTERS':
                    options.model = Character;
                    options.sort = '-createdAt';
                    listResources(req, res, options);
                    break;

                case 'GET_RANDOM_QUOTE':
                    getQuote(req, res, options);
                    break;

                case 'GET_LATEST_QUOTE':
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
