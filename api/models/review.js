const mongoose=require('mongoose');

const ReviewSchema = new mongoose.Schema({
  placeId: String,         
  rating: Number,
  text: String,
  date: { type: Date, default: Date.now }
});

const Review= mongoose.model('Review', ReviewSchema);
module.exports=Review;