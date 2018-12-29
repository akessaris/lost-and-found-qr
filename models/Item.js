const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

require("./User");

//Represents item
const ItemSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // a reference to a User object
  name: {type: String, required: true}, //name of item
  desc: {type: String, required: false}, //optional description of item
  lost: {type: Boolean, required: true}, //is item currently lost?
  found: {type: Boolean}, //has the item been found
  qrCode: {type: String} //QR Code
});

//Export Game and user model
module.exports = mongoose.model('Item', ItemSchema);
