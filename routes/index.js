var express = require('express');
var bodyParser = require('body-parser').json();
var User = require('../models/user');
var Reviews = require('../models/reviews');
var Course = require('../models/course');
var mongoose = require("mongoose");
var router = express.Router();


//authroization middleware
router.use(function (req, res, next) {
  if(req.headers.authorization){
    let credentials = new Buffer(req.headers.authorization.split(" ")[1], 'base64').toString().split(':')
    if(credentials[0] && credentials[1]){
      User.authenticate(credentials[0], credentials[1], function(error, user){
        if(error || !user){
          let err = new Error("Wrong Email or Password")
          err.status = 401;
          return next();
        }else {
          req.user = user;
          next()
        }
      })
    }else {
      return next();
    }
  }else {
    next()
  }
})


// send a friendly greeting for the root route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Course Review API'
  });
});

// Get Authorized User
router.get('/api/users', (req, res, next) => {
  if(req.user){
    res.json({
     User: req.user,
     message: 'request complete'
    })
  }else {
    let err = new Error('Correct email and password in header are required')
    err.status = 401;
    return next(err);
  }
});


//**POST new user
router.post('/api/users', bodyParser, (req, res, next) => {
  var user = new User(req.body);
  user.save(function(err) {
    if (err){
      if(err.name === "ValidationError"){
        err.status = 400;
      }
      next(err)
    }else {
      res.setHeader("Location", "/");
      res.status(201).send("User Saved")
    }
  })
});

//GET courses
router.get('/api/courses', (req, res) => {
  Course.find({},{title: 1})
  .exec(function(err, courses) {
     if (err) throw err;
     res.json({
       courses: courses,
       message: 'request complete'
     })
   })
});

//GET specific course
router.get('/api/courses/:id', (req, res) => {
  Course.findById(req.params.id)
  .populate('user')
  .populate('reviews')
  .exec(function(err, course) {
     if (err) throw err;
     res.json({
       course: course,
       message: 'request complete'
     })
   })
});

//**POST new course
router.post('/api/courses', bodyParser, (req, res, next) => {
  if(req.user){
    var course = new Course(req.body);
    course.save()
    .then(item => {
      res.setHeader("Location", '/');
      res.status(201).send();
      })
    .catch(err => {
      if(err.name === "ValidationError"){
        err.status = 400;
      }
      next(err);
    });
  }else {
    let err = new Error("Not Authorized");
    err.status = 401;
    next(err)
  }
});

//**Put edit course
router.put('/api/courses/:id', bodyParser, (req, res, next) => {
  if(req.user){
    Course.findByIdAndUpdate(req.params.id, req.body,{new: true},
      (err, course) => {
          if (err){
            if(err.name === "ValidationError"){
              err.status = 400;
            }
            next(err)
          }else {
          return res.status(204).send();
        }
      })
    }else {
      let err = new Error("Not Authorized");
      err.status = 401;
      next(err)
    }
});

//**POST new review
router.post('/api/courses/:courseId/reviews', bodyParser, (req, res, next) => {
  if(req.user){
    var review = new Reviews(req.body);
    review.save()
    .then(item => {
      Course.update(
         { _id: req.params.courseId },
         { $addToSet: { reviews: item._id  }},
         (err, course) => {
             if (err){
               next(err);
             }else{
               res.setHeader("Location", '/api/courses/'+req.params.courseId);
               return res.status(201).send();
             }
         })
      })
      .catch(err => {
        if(err.name === "ValidationError"){
          err.status = 400;
        }
        next(err);
      });
  }else {
    let err = new Error("Not Authorized");
    err.status = 401;
    next(err)
  }
});


module.exports = router;
