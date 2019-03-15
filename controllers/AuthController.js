const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../models/User");

const userController = {};

//Home page
userController.home = function(req, res) {
  res.render('index', {user : req.user});
};

// Go to registration page
userController.register = function(req, res) {
  res.render('register');
};

// Post registration
userController.doRegister = function(req, res) {
  User.register(new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    address: {
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
    },
    username : req.body.username}), req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.redirect('register');
    }
    else {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/');
      });
    }
  });
};

// Go to login page
userController.login = function(req, res) {
  res.render('login');
};

// Post login
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
      res.redirect('/');
  });
};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;
