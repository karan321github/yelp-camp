const mongoose = require('mongoose');
const passport = require('passport');
const passpoertLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
        email: {
                type: String ,
                required: true ,
                unique: true ,
        }
})
userSchema.plugin(passpoertLocalMongoose);

module.exports = mongoose.model('User' , userSchema);

