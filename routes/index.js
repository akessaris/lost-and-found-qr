const express = require('express');
const router = express.Router();
const auth = require("../controllers/AuthController");
const item = require("../controllers/ItemController");

// rout to home page
router.get('/', auth.home);

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);

// route for adding new item
router.get('/new-item', item.newItem);

// route for adding new item
router.post('/new-item', item.addNewItem);

// route for displaying user's items
router.get('/my-items', item.myItems);

// route for updating user's items
router.post('/my-items', item.updateMyItems);

// route for form to let user know someone has found their item
router.get('/found-item/:qrCode', item.foundItem);

// route for processing how item should be returned
router.post('/found-item', item.returnItem);

module.exports = router;
