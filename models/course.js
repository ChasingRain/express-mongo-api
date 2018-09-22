var mongoose = require('mongoose');
var courseSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  estimatedTime: {
    type: String
  },
  materialsNeeded: {
    type: String
  },
  steps: [{
    stepNumber: {
      type: Number
    },
    title:{
      type: String,
      required: true
    }
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
});

var Course = mongoose.model('Course', courseSchema);
module.exports = Course;
