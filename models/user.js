const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,   
    }
})

// plm automatically creates a username field for us, so we don't need to define it in our schema.

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);