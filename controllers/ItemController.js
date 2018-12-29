const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../models/User");
const Item = require("../models/Item");

const itemController = {};

const QRCode = require('qrcode')

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
    const item = new Item({
      user: req.user._id,
      name: req.body.name,
      desc: req.body.desc,
      lost: false,
      found: false
    });
    QRCode.toDataURL("https://enigmatic-taiga-63904.herokuapp.com/found-item/" + req.user._id + item._id, function (err, url) {
      if (err) {
        console.log(err);
      }
      else {
        item.qrCode = url;
        item.save((err) => {
          if (err) {
            console.log(err);
          }
          else {
            res.render("qr-code", {
              user: req.user,
              canvas: url
            });
          }
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
    Item.find({user : req.user._id},function(err, items) {
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
    Item.findOne({_id: Object.keys(req.body)[0]}, function(err, item) {
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
    Item.findOne({qrCode : url}, function(err, item) {
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
