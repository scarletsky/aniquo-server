/*
 * user model
 */

var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {type: String, default: ''},
  passwordHash: {type: String, default: ''},
  contributeCount: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
});

UserSchema
  .virtual('password')
  .set(function (password) {
    var salt = bcrypt.genSaltSync(10);
    this.passwordHash = bcrypt.hashSync(password, salt);
  })
  .get(function () { return this.passwordHash; });

UserSchema.methods = {
  auth: function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
  }
};

UserSchema.index({name: 1});

mongoose.model('User', UserSchema);
