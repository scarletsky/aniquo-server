/*
 * source model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var mongoosePaginate = require('mongoose-paginate-pages');

var SourceSchema = new Schema({
    name: {type: String, unique: true},
    alias: {type: Array},
    info: {type: String},
    cover: {type: String},
    likeIds: {type: Array, default: []},
    likersCount: {type: Number, default: 0},
    viewsCount: {type: Number, default: 0},
    charactersCount: {type: Number, default: 0},
    quotesCount: {type: Number, default: 0},
    contributorId: {type: ObjectId},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

SourceSchema.index({name: 1, alias: 1, createdAt: -1, updatedAt: -1});
SourceSchema.plugin(mongoosePaginate);

mongoose.model('Source', SourceSchema);
