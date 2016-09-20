var express                 = require('express'),
    router                  = express.Router(),
    User                    = require('../models/user'),
    middleware              = require('../middleware');
    

//INDEX ROUTES
router.get('/', function(req, res) {
    res.redirect('/users');
});

router.get("/users", function(req, res) {
    User.find({}, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {user: user});
        }
    });
});
//NEW ROUTE
router.get('/users/new',  middleware.isLoggedIn, function(req, res) {
    res.render('./user/new');
});
//CREATE ROUTE
router.post('/users', middleware.isLoggedIn, function(req, res) {
    User.create(req.body.user, function(err, newUser) {
        if (err) {
            console.log(err);
        } else {
            newUser.manager.id = req.user._id;
            newUser.manager.username = req.user.username;
            newUser.save();
            console.log(newUser);
            res.redirect('./users');
        }
    });
});
//SHOW ROUTE
router.get('/users/:id', function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        res.render('./user/show', {user: foundUser});
    });
});
//EDIT ROUTE
router.get('/users/:id/edit', middleware.checkUserManager, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        res.render('./user/edit', {user: foundUser});
    });
});
//UPDATE ROUTE
router.put('/users/:id/',  middleware.checkUserManager, function(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/users/' + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete('/users/:id',  middleware.checkUserManager, function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/users');
        }
    });
});

module.exports = router;