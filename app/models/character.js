/*
 * character model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var mongoosePaginate = require('mongoose-paginate-pages');

var CharacterSchema = new Schema({
    name: {type: String},
    alias: {type: Array},
    info: {type: String, default: ''},
    avatar: {type: String},
    sourceId: {type: ObjectId},
    quotesCount: {type: Number, default: 0},
    contributorId: {type: ObjectId},
    createdAt: {type: Date, default: Date.now}
});

CharacterSchema.index({name: 1, alias: 1});
CharacterSchema.plugin(mongoosePaginate);

mongoose.model('Character', CharacterSchema);
