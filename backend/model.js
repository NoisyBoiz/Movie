const mongoose = require('mongoose');
const {Schema} = mongoose;

const users = new Schema({
    userName: {type:String,unique: true},
    email: {type:String,unique: true},
    password: String,
    createDate: {type:Date,default:Date.now},
})
module.exports = mongoose.model('users', users);