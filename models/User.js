const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

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
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
