const mongoose = require("mongoose");
require("./Item");
require("./User");

//Represents QR code
const QRSchema = new mongoose.Schema({
  //QR Code
  qrCode: {
    type: String
  },
  //which item (if any), has this been assigned to
  item_assigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item', // a reference to a Item object
    default: undefined
  },
  //which user (if any), has this been assigned to
  user_assigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // a reference to a User object
    default: undefined
  }
});

//Export QR Code model
module.exports = mongoose.model('QRCode', QRSchema);
