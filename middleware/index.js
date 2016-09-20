    //var Manager = require('../models/manager');
    var User            = require('../models/user'),
        middlewareObj   = {};

    middlewareObj.isLoggedIn = function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You need to be logged in to do that!");
        res.redirect('/users');
    }

    middlewareObj.checkUserManager = function(req, res, next) {
        if (req.isAuthenticated()) {
            User.findById(req.params.id, function(err, foundUser) {
                if (err) {
                    req.flash('error', 'User not found');
                    res.redirect('back');
                } else {
                    if(foundUser.manager.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash('error', "You aren't that user's manager");
                        res.redirect('back');
                    }
                }
            });
        } else {
            req.flash("error", "You don't have permission to do that");
            res.redirect('back');
        }
    }

    module.exports = middlewareObj;