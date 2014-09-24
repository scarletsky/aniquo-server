/*
 * source model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var mongoosastic = require('mongoosastic');

var SourceSchema = new Schema({
  name: {type: String, unique: true, es_indexed: true},
  alias: {type: Array, es_indexed: true},
  info: {type: String},
  contributorId: {type: ObjectId, es_indexed: true},
  createdAt: {type: Date, default: Date.now, es_type: 'date', es_indexed: true}
});

SourceSchema.index({name: 1, alias: 1});
SourceSchema.plugin(mongoosastic)

mongoose.model('Source', SourceSchema);
