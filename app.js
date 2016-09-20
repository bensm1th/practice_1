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
    config              = require('./config/config'),
    //ROUTES
    userRoutes          = require('./routes/users'),
    managerRoutes       = require('./routes/managers');


mongoose.connect(config.dbLocation);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(flash());
//PASSPORT CONFIG
app.use(require('express-session')({
    secret: config.passportSecret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Manager.authenticate()));
passport.serializeUser(Manager.serializeUser());
passport.deserializeUser(Manager.deserializeUser());

passport.use(new FacebookStrategy({
    clientID: config.facebookId,
    clientSecret: config.facebookSecret,
    callbackURL: config.facebookURL
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
