/*
 * quote model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var QuoteSchema = new Schema({
  characterId: {type: ObjectId},
  quote: {type: String},
  likeCount: {type: Number, default: 0},
  viewCount: {type: Number, default: 0},
  reference: {type: String},
  contributorId: {type: ObjectId},
  createdAt: {type: Date, default: Date.now},
});

QuoteSchema.index({createdAt: -1});

mongoose.model('Quote', QuoteSchema);
