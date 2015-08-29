var user = require('./user');
var source = require('./source');
var character = require('./character');
var quote = require('./quote');

exports.search = function(req, res) {
    var type = req.query.type || 'all';
    /**
     * from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
     */
    req.query.keyword = req.query.keyword ? req.query.keyword.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1") : '';

    switch (type) {
        case 'user':
            user.getUsersByKeyword(req, res);
            break;

        case 'source':
            source.getSourcesByKeyword(req, res);
            break;

        case 'character':
            character.getCharactersByKeyword(req, res);
            break;

        case 'quote':
            quote.getQuoteByKeyword(req, res);
            break;

        default:
            res.send([]);
    }
};
