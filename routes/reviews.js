const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/review');
const reviewController = require('../controllers/Reviews');
const catchAsync = require('../utils/catchAsync');
const {validateReview,isLoggedIn,reviewAuthor} = require('../middleware');
const campground = require('../models/campground');

router.post('/',isLoggedIn, validateReview, catchAsync(reviewController.createReview));

router.delete('/:reviewId',isLoggedIn,reviewAuthor, catchAsync(reviewController.deleteReview));


module.exports=router;