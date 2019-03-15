const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');

// is the environment variable, NODE_ENV, set to PRODUCTION?
// console.log("process.env.NODE_ENV = " + process.env.NODE_ENV);

// Find database to populate
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/lf';
}
console.log('connected to ' + dbconf);
mongoose.connect(dbconf, {useNewUrlParser: true});

// Generate qr codes
const QRCode = require('qrcode');
const QRCodeSchema = require("./models/QRCode"); //get QR data model
const add = 5; //number of qr codes to add;
const location = path.join("localhost/5000", "found-item", uuidv4()); //website path - TODO: change to current site

// Generate qr codes
for (let i = 0; i < add; i++) {
  QRCode.toDataURL(location)
    .then(url => {
      const qr_code = new QRCodeSchema ({qrCode: url});
      qr_code.save()
        .then(qr_code => {
          if (i+1 === add) {
            mongoose.disconnect(()=> {
              console.log(add + " QR codes added to the DB");
            });
          }
        })
        .catch(err => {
          console.error(err)
        });
    })
    .catch(err => {
      console.error(err)
    })
}
