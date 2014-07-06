/*
 * character model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CharacterSchema = new Schema({
  name: {type: String},
  nickname: {type: Array},
  info: {type: String, default: ''},
  sourceId: {type: ObjectId},
  quotesCount: {type: Number, default: 0},
  contributorId: {type: ObjectId},
  createdAt: {type: Date, default: Date.now}
});

CharacterSchema.index({createdAt: -1});
CharacterSchema.index({name: 1, nickname: 1});

mongoose.model('Character', CharacterSchema);
