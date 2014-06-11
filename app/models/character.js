/*
 * character model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CharacterSchema = new Schema({
  name: {type: String, unique: true},
  nickname: {type: Array},
  source_id: {type: ObjectId},
  quote_count: {type: Number, default: 0},
  create_time: {type: Date, default: Date.now},
  is_pass: {type: Boolean, default: false}
});

CharacterSchema.index({create_time: -1});
CharacterSchema.index({name: 1, nickname: 1});

mongoose.model('Character', CharacterSchema);
