var mongoose = require('mongoose');
var reviewSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId
  },
  postedOn: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: String
});

var Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
