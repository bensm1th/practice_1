var mongoose                = require('mongoose'),
    passportLocalMongoose   = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    
    firstName: String,
    lastName: String,
    username: String,
    employeeNumber: Number,
    manager: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Manager"
        },
        username: String
    }
});

module.exports = mongoose.model('User', userSchema);

