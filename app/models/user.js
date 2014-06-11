/*
 * user model
 */

var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {type: String, default: ''},
  password_hash: {type: String, default: ''},
  contribute_count: {type: Number, default: 0},
  create_time: {type: Date, default: Date.now}
});

UserSchema
  .virtual('password')
  .set(function (password) {
    var salt = bcrypt.genSaltSync(10);
    this.password_hash = bcrypt.hashSync(password, salt);
  })
  .get(function () { return this.password_hash; });

UserSchema.methods = {
  auth: function (password) {
    return bcrypt.compareSync(password, this.password_hash);
  }
};

UserSchema.index({name: 1});

mongoose.model('User', UserSchema);
