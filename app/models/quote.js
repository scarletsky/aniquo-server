/*
 * quote model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var QuoteSchema = new Schema({
  character_id: {type: ObjectId},
  quote: {type: String},
  like_count: {type: Number, default: 0},
  source_id: {type: ObjectId},
  reference: {type: String},
  contributor_id: {type: ObjectId},
  create_time: {type: Date, default: Date.now},
  is_pass: {type: Boolean, default: false}
});

QuoteSchema.index({create_time: -1});

mongoose.model('Quote', QuoteSchema);
