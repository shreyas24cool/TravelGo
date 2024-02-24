const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const Listing = require("./listing.js");

let userSchema = new Schema({
    email : {
        type : String,
        required : true
    },
    lists : [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],
});

userSchema.plugin(passportLocalMongoose);

userSchema.post("findOneAndDelete", async (user)=>{
        await Listing.deleteMany({_id : {$in : user.lists}});
});

let User = mongoose.model("User", userSchema);

module.exports = User;