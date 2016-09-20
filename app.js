var express             = require('express'),
    app                 = express(),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    methodOverride      = require('method-override'),
    User                = require('./models/user'),
    Manager             = require('./models/manager'),
    port                = process.env.PORT || '3000',
    passport            = require('passport'),
    localStrategy       = require('passport-local'),
    flash               = require('connect-flash'),
    FacebookStrategy    = require('passport-facebook'),
    //ROUTES
    userRoutes          = require('./routes/users'),
    managerRoutes       = require('./routes/managers');


mongoose.connect('mongodb://localhost/practice_1');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(flash());
//PASSPORT CONFIG
app.use(require('express-session')({
    secret: "Out of many, One",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Manager.authenticate()));
passport.serializeUser(Manager.serializeUser());
passport.deserializeUser(Manager.deserializeUser());

passport.use(new FacebookStrategy({
    clientID: 290461301336785,
    clientSecret: '6d708f92562865377323ab7a8d1aa80f',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use(userRoutes);
app.use(managerRoutes);
app.listen(port, function() {
    console.log('practice_1 listening on port 3000');
});
