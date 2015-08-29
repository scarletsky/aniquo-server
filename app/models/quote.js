/*
 * quote model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var mongoosePaginate = require('mongoose-paginate-pages');

var QuoteSchema = new Schema({
    characterIds: {type: [ObjectId]},
    quote: {type: String},
    scene: {type: String},
    likersCount: {type: Number, default: 0},
    likerIds: {type: Array, default: []},
    viewsCount: {type: Number, default: 0},
    reference: {type: String},
    contributorId: {type: ObjectId},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

QuoteSchema.index({_id: -1, likeIds: -1, createdAt: -1, updatedAt: -1});
QuoteSchema.plugin(mongoosePaginate);

mongoose.model('Quote', QuoteSchema);
