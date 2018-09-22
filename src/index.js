'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

const app = express();

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/course-api");

var db = mongoose.connection;

db.on("error", function(err){
	console.error("connection error:", err);
});

db.once("open", function(){
	console.log("db connection successful");
});

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// TODO add additional routes here

// include routes
var routes = require('../routes/index');
app.use('/', routes);

//uncomment this route in order to test the global error handler
app.get('/error', function (req, res) {
  throw new Error('Test error');
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
  });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
