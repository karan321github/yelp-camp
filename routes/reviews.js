const express = require('express');
const router = express.Router({mergeParams: true});
const reviews = require('../controllers/reviews.js');
const Review = require('../models/review');
const Campground = require('../models/campground');
const {validateReview , isLoggedIn , isReviewAuthor} = require('../middileware.js');
const catchAsync = require('../utils/catchAsync.js');
router.post('/' , isLoggedIn , validateReview , catchAsync(reviews.createReview));
  
router.delete('/:reviewId' , isLoggedIn , isReviewAuthor , catchAsync(reviews.deleteReview));

module.exports = router;