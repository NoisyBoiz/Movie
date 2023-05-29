const mongoose = require('mongoose');
const db = require('./connect');
db.connect();
const port = 3003;
const UserSchema = new mongoose.Schema({
    userName: {type:String},
    email: {type:String},
    password: String,
    createDate: {type:Date,default:Date.now},
});
const User = mongoose.model('users', UserSchema);
User.createIndexes();
 
// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
    resp.send("App is Working");
});
 
app.post("/register", async (req, resp) => {
    try {
        const user = new User(req.body);
        const checkUser= await User.find({email:req.body.email});
        if(checkUser.length!==0){
            resp.send("404");
            console.log("User already register");
        }
        else{
            resp.send("200");
            await user.save();
        }
    } 
    catch (e) {
         resp.send("404");
    }
});
app.get("/get/:email/:password", async (req, resp) => {
    try {
        const result = await User.find({email:req.params.email,password:req.params.password});
        if(result.length!==0){
            resp.send({name:result[0].userName,email:result[0].email});
        }
        else{
            resp.send("404");
        }
      
    } catch (e) {
        resp.send("404");
    }
});
app.listen(port, () => console.log("App is listening ..."));