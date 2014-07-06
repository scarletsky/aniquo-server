/*
 * source model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var SourceSchema = new Schema({
  name: {type: String, unique: true},
  alias: {type: Array},
  info: {type: String},
  contributorId: {type: ObjectId},
  createdAt: {type: Date, default: Date.now}
});

SourceSchema.index({createdAt: -1});
SourceSchema.index({name: 1, alias: 1});

mongoose.model('Source', SourceSchema);
