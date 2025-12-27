const express = require('express');
const Review = require('../models/review.js')

const router = express.Router();

// Get all reviews for a place
router.get('/:placeId', async (req, res) => {
  try {
    const reviews = await Review.find({ placeId: req.params.placeId }).sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Post a new review
router.post('/', async (req, res) => {
  const { placeId, rating, text } = req.body;
  try {
    const review = await Review.create({ placeId, rating, text });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports=router;

