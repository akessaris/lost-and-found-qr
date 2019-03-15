const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

require("./Item");

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    address: {
        street: String,
        city: String,
        state: String,
        zip: Number
    },
    email: {type: String,required: true},
    password: String,
    items: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Item', // a reference to an Item object
      default: []
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
