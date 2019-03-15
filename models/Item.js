const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

require("./User");
require("./QRCode");

//Represents item
const ItemSchema = new mongoose.Schema({
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // a reference to a Item's owner (User object)
  name: {type: String}, //name of item
  desc: {type: String}, //optional description of item
  lost: {type: Boolean}, //is item currently lost?
  found: {type: Boolean}, //has the item been found
  //assigned QR Code
  qrCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRCode', // a reference to a QRCode object
    default: undefined
  }
});

//Export Item model
module.exports = mongoose.model('Item', ItemSchema);
