const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {type: String,required: true},
    email: {type: String,required:true,unique: true},
    password: {type:String,required:true},
    token: {type:String},
    isVerified: {type: Boolean, default: false},
    role: {type:String, default: "user"},
    ownership: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
})

const User = mongoose.model('UserCollection',UserSchema);
module.exports = User;