var mongoose                = require('mongoose'),
    passportLocalMongoose   = require('passport-local-mongoose');

var managerSchema = new mongoose.Schema({
    username: "String",
    password: "String"
});

managerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Manager", managerSchema);