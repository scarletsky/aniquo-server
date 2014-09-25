/*
 * quote model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var mongoosastic = require('mongoosastic');

var QuoteSchema = new Schema({
  characterId: {type: ObjectId, es_indexed: true},
  quote: {type: String},
  likeCount: {type: Number, default: 0, es_indexed: true},
  likerIds: {type: Array, default: []},
  viewCount: {type: Number, default: 0, es_indexed: true},
  reference: {type: String},
  contributorId: {type: ObjectId, es_indexed: true},
  createdAt: {type: Date, default: Date.now, es_indexed: true},
});

QuoteSchema.index({_id: -1, likeIds: -1, createdAt: -1});
QuoteSchema.plugin(mongoosastic);

mongoose.model('Quote', QuoteSchema);
