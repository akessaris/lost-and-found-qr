// Packages
const mongoose = require("mongoose");
const passport = require("passport");
const QRCode = require('qrcode');

// Models
const UserModel = require("../models/User");
const ItemModel = require("../models/Item");
const QRModel = require("../models/QRCode");

// Controller object to export
const itemController = {};

//Display new item page
itemController.newItem = function(req, res) {
  if (!req.user) {
    res.render('login');
  }
  else {
    res.render("new-item", {user: req.user});
  }
};

//Add new item
itemController.addNewItem = function(req, res) {
  if (!req.user) {
    res.redirect('login');
  }
  else {
    //Add new Item to db, storing user id
    const item = new ItemModel({
      owner: req.user._id,
      name: req.body.name,
      desc: req.body.desc,
      lost: false,
      found: false
    });
    //Find a qr code that hasn't been assigned to an item or user
    QRModel.findOne({item_assigned: undefined, user_assigned: undefined}, (err, qrCode) => {
      if (err) {
        console.log(err);
      }
      else {
        //Assign item and user id to qr Code
        qrCode.item_assigned = item._id;
        qrCode.user_assigned = req.user._id;

        //Save QR code to DB
        qrCode.save()
          .then(qrCode => {
            console.log("Successfully assigned and saved qr code");

            //Add qr code reference to item
            item.qrCode = qrCode._id;

            //Save item to DB
            item.save()
              .then(item => {
                console.log("Successfully saved item");

                //Push item to user's item list
                UserModel.findOne({_id: req.user._id}, (err, user) => {
                  //Add item to user's item list
                  user.items.push(item);

                  //Save updated user to DB
                  user.save()
                    .then(user => {
                      //Display assigned QR code on new page
                      res.render("qr-code", {
                      user: req.user,
                      canvas: qrCode.qrCode
                      });
                    })
                    .catch(err => {
                      console.error(err)
                    });
                });
              })
              .catch(err => {
                console.error(err)
              });
          })
          .catch(err => {
            console.error(err)
          });
        }
    });
  }
};

// Display user's items
itemController.myItems = function(req, res) {
  if (!req.user) {
    res.redirect('login');
  }
  else {
    ItemModel.find({user : req.user._id},function(err, items) {
      res.render("my-items", {
        'items': items,
        "user": req.user
      });
    });
  }
};

// Update user's items
itemController.updateMyItems = function(req, res) {
  if (!req.user) {
    res.redirect('login');
  }
  else {
    //Find and update item
    ItemModel.findOne({_id: Object.keys(req.body)[0]}, function(err, item) {
      const lost = item.lost ? false : true;
      const found = lost ? false : true;

      item.lost = lost;
      item.found = found;

      item.save((err) => {
        if (err) {
          console.log(err);
        }
        else {
          res.redirect("my-items");
        }
      });
    });
  }
};

// Display page if someone finds an item
itemController.foundItem = function(req, res) {
  const midIndex = Math.ceil(req.params.qrCode.length / 2);
  const userId = req.params.qrCode.slice(0, midIndex);
  const itemId = req.params.qrCode.slice(midIndex);

  QRCode.toDataURL("https://enigmatic-taiga-63904.herokuapp.com/found-item/" + userId + itemId, function (err, url) {
    ItemModel.findOne({qrCode : url}, function(err, item) {
      if (err || item === null) {
        res.render('found-item');
      }
      else {
        //Alert user item has been found
        item.found = true;
        item.save((err) => {
          if (err) {
            console.log(err);
          }
          // if (req.user) {
          //   res.render("found-item", {
          //     user: req.user,
          //     item: item
          //   });
          // }
          // else {
            res.render("found-item", {
              item: item
            });
          // }
        });
      }
    });
  });
};

// Display page if user has selected a return option
itemController.returnItem = function(req, res) {
  const returnMethod = req.body.returnMethod;
  if (returnMethod !== null) {
    if (returnMethod === "dropoff") {
      res.render("return-item", {
        dropoff: "dropoff"
      });
    }
    else {
      res.render("return-item", {
        pickup: "pickup"
      });
    }
  }
  else {
    res.render("index");
  }
};

module.exports = itemController;
