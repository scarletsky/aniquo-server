var mongoose = require('mongoose');

require('./user');
require('./character');
require('./quote');
require('./source');

exports.User = mongoose.model('User');
exports.Character = mongoose.model('Character');
exports.Quote = mongoose.model('Quote');
exports.Source = mongoose.model('Source');
