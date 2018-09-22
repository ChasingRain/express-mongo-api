'use strict'

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sandbox');

var db = mongoose.connection;

db.on('error', function(err){
  console.error("connection error:", err);
})

db.once('open', function(){
    console.log('db connection successful')
    //more communication
    // User
    // _id (ObjectId, auto-generated)
    // fullName (String, required)
    // emailAddress (String, required, must be unique and in correct format)
    // password (String, required)
    // Course
    // _id (ObjectId, auto-generated)
    // user (_id from the users collection)
    // title (String, required)
    // description (String, required)
    // estimatedTime (String)
    // materialsNeeded (String)
    // steps (Array of objects that include stepNumber (Number), title (String, required) and description (String, required) properties)
    // reviews (Array of ObjectId values, _id values from the reviews collection)
    // Review
    // _id (ObjectId, auto-generated)
    // user (_id from the users collection)
    // postedOn (Date, defaults to “now”)
    // rating (Number, required, must fall between “1” and “5”)
    // review (String)
    db.close();
})
