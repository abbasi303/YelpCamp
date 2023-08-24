const express =  require('express')
const router = express.Router({mergeParams: true});
const ExpressError =require('../utils/ExpressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
const catchAsync =require('../utils/catchAsync')
const {validateReview,isLoggedIn,isReviewAuthor } =  require('../middleware/middleware')
const reviewsControllers = require('../controllers/review')

router.post('/',isLoggedIn,validateReview, catchAsync(reviewsControllers.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviewsControllers.deleteReview))

module.exports = router;