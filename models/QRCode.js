const mongoose = require("mongoose");
require("./Item");

//Represents QR code
const QRSchema = new mongoose.Schema({
  //QR Code
  qrCode: {
    type: String
  },
  //which item (if any), has this been assigned to
  assigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item' // a reference to a Item object,
  }
});

//Export QR Code model
module.exports = mongoose.model('QRCode', QRSchema);
