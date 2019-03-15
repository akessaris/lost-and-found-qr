const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//Routing
const index = require('./routes/index');
const users = require('./routes/users');

//Server setup
const app = express();
const port = process.env.PORT || 5000;

//View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//DB configuration
const User = require('./models/User');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Logger
app.use((req, res, next) => {
  console.log("\n" + req.method, req.path, '\n=====\n','req.query: ', req.query, '\n req.body: ', req.body, '\n');
  if (req.user) {
    console.log("USER: " + req.user);
  }
  next();
});

//Session management
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
  process.env.MONGOLAB_ORANGE_URI ||
  'mongodb://localhost/lf';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, {useNewUrlParser: true}, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;

app.use(cookieParser());
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: db })
}));

//Passport configuration
const flash = require("express-flash-messages");
app.use(flash());

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
  User.findById(userId, (err, user) => done(err, user));
});

//Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port);
