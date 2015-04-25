var user = require('../app/controllers/user');
var source = require('../app/controllers/source');
var character = require('../app/controllers/character');
var quote = require('../app/controllers/quote');
var search = require('../app/controllers/search');
var auth = require('../app/controllers/auth');
var upload = require('../app/controllers/upload');
var expressJwt = require('express-jwt');
var customJwt = require('./middlewares/customJwt');
var access = require('./middlewares/access');

module.exports = function (app, config) {
  var apiPrefix = '/api';
  var jwtOptions = {
    secret: config.sessionSecret
  };

  // auth
  app.post(apiPrefix + '/authenticate', auth.authenticate);
  app.post(apiPrefix + '/register', auth.register);

  // users
  app.get(apiPrefix + '/user', expressJwt(jwtOptions), user.getUserByToken);
  app.put(apiPrefix + '/user', expressJwt(jwtOptions), user.putUser)
  app.get(apiPrefix + '/users', user.getUsers);
  app.get(apiPrefix + '/users/:userId', user.getUserById);

  // sources
  app.get(apiPrefix + '/source/check', source.checkSource);
  app.get(apiPrefix + '/sources', source.getSources);
  app.post(apiPrefix + '/sources', expressJwt(jwtOptions), source.postSource);
  app.get(apiPrefix + '/sources/:sourceId', source.getSourceById);
  app.put(apiPrefix + '/sources/:sourceId', expressJwt(jwtOptions), source.putSourceById);
  app.get(apiPrefix + '/sources/:sourceId/characters', character.getCharactersBySourceId);

  // characters
  app.get(apiPrefix + '/character/check', character.checkCharacter);
  app.get(apiPrefix + '/characters', character.getCharacters);
  app.post(apiPrefix + '/characters', expressJwt(jwtOptions), character.postCharacter);
  app.get(apiPrefix + '/characters/:characterId', character.getCharacterById);
  app.put(apiPrefix + '/characters/:characterId', expressJwt(jwtOptions), character.putCharacterById);
  app.get(apiPrefix + '/characters/:characterId/quotes', quote.getQuotesByCharacterId);

  // quotes
  app.get(apiPrefix + '/quotes', quote.getQuotes);
  app.post(apiPrefix + '/quotes', expressJwt(jwtOptions), quote.postQuote);
  app.get(apiPrefix + '/quotes/:quoteId', customJwt(jwtOptions), quote.getQuoteById);
  app.put(apiPrefix + '/quotes/:quoteId', expressJwt(jwtOptions), quote.putQuoteById);
  app.put(apiPrefix + '/user/like/quotes/:quoteId', expressJwt(jwtOptions), quote.putQuoteLikerIdById);
  app.delete(apiPrefix + '/user/like/quotes/:quoteId', expressJwt(jwtOptions), quote.deleteQuoteLikerIdById);

  // search
  app.get(apiPrefix + '/search', search.search);

  // upload
  app.get(apiPrefix + '/upload/token', expressJwt(jwtOptions), upload.getUploadToken);
};

