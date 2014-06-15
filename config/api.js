var user = require('../app/controllers/user');
var source = require('../app/controllers/source');
var character = require('../app/controllers/character');
var quote = require('../app/controllers/quote');
var search = require('../app/controllers/search');

module.exports = function (app) {
  var apiPrefix = '/api';

  // users
  app.get(apiPrefix + '/users', user.getUsers);
  app.get(apiPrefix + '/users/:userId', user.getUserById);

  // sources
  app.get(apiPrefix + '/sources', source.getSources);
  app.get(apiPrefix + '/sources/:sourceId', source.getSourceById);
  app.get(apiPrefix + '/sources/:sourceId/characters', character.getCharactersBySourceId);

  // characters
  app.get(apiPrefix + '/characters', character.getCharacters);
  app.get(apiPrefix + '/characters/:characterId', character.getCharacterById);
  app.get(apiPrefix + '/characters/:characterId/quotes', quote.getQuotesByCharacterId);

  // quotes
  app.get(apiPrefix + '/quotes', quote.getQuotes);
  app.get(apiPrefix + '/quotes/:quoteId', quote.getQuoteById);

  // search
  app.get(apiPrefix + '/search', search.search);
};
