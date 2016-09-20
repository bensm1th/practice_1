//I will need express, router, passport, and manager
var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport'),
    Manager     = require('../models/manager');

//REGISTER FORM
router.get('/register', function(req, res) {
    res.render('register');
});
//HANDLE SIGNUP LOGIC
router.post('/register', function(req, res) {
    var newManager = new Manager({ username: req.body.username});

    Manager.register(newManager, req.body.password, function(err, manager) {
        if (err) {
            console.log(err);

            return res.render('register');
        }
        passport.authenticate('local')(req, res, function() {
            req.flash('success', "Welcome to Ben's practice_1 App " + manager.username)
            res.redirect('/users');
        });
    });
});

//SHOW LOGIN FORM
router.get('/login', function(req, res) {
    res.render('login');
});
//HANDLE LOGIN LOGIC
router.post('/login', passport.authenticate('local',{
    successRedirect: '/users',
    failureRedirect: '/login'
}), function(req, res) {  
});
//LOGOUT ROUTE
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/users');
});

module.exports = router;