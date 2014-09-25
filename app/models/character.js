/*
 * character model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var mongoosastic = require('mongoosastic');

var CharacterSchema = new Schema({
  name: {type: String, es_indexed: true},
  alias: {type: Array, es_indexed: true},
  info: {type: String, default: ''},
  sourceId: {type: ObjectId, es_indexed: true},
  quotesCount: {type: Number, default: 0, es_indexed: true},
  contributorId: {type: ObjectId, es_indexed: true},
  createdAt: {type: Date, default: Date.now, es_indexed: true}
});

CharacterSchema.index({name: 1, alias: 1});
CharacterSchema.plugin(mongoosastic);

mongoose.model('Character', CharacterSchema);
