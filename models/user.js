const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// username & password will be automatically defined by passport-local-mongoose (since it is used as a plugin into our userSchema)
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);