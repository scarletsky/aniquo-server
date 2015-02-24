/*
 * source model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var mongoosePaginate = require('mongoose-paginate');

var SourceSchema = new Schema({
  name: {type: String, unique: true},
  alias: {type: Array},
  info: {type: String},
  cover: {type: String},
  contributorId: {type: ObjectId},
  createdAt: {type: Date, default: Date.now, es_type: 'date'}
});

SourceSchema.index({name: 1, alias: 1});
SourceSchema.plugin(mongoosePaginate);

mongoose.model('Source', SourceSchema);
