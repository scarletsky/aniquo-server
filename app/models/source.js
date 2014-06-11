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
  create_time: {type: Date, default: Date.now},
  is_pass: {type: Boolean, default: false}
});

SourceSchema.index({create_time: -1});
SourceSchema.index({name: 1, alias: 1});

mongoose.model('Source', SourceSchema);
