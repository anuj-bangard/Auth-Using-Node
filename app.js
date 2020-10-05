//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
mongoose.connect('mongodb://localhost:27017/authDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

/*MongoDB Schemas*/
const userSchema = new mongoose.Schema({
    useremail:String,
    password:String
});


const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = (req.body.password);
    User.findOne({useremail:username},function(err,foundUser){
        if(!err){
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    // result == true
                    if(result==true){
                        res.render("secrets");
                    }else{
                        console.log("Wrong Password");
                    }
                });
                
            }else{
                res.redirect("/register");
            }
        }else{
            console.log(err);
        }
    });
    
});

app.post("/register",function(req,res){
    const username = req.body.username;
    const password = (req.body.password);
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            useremail:username,
            password:hash
        });
    
    
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
                console.log("User Added Successfully");
            }
        });
    });
});

app.listen(3000,function(){
    console.log("Server Running");
})