const express = require('express')
const router = express.Router();
const catchAsync =require('../utils/catchAsync')
const campgroundControllers = require('../controllers/campground')
const Campground = require('../models/campground')
const{isLoggedIn, isAuthor, validateCampground}  = require('../middleware/middleware')



router.get('/',catchAsync(campgroundControllers.index));




router.get('/new',isLoggedIn, campgroundControllers.getnewForm);

router.post('/', isLoggedIn ,validateCampground, catchAsync(campgroundControllers.createCampground))


router.get('/:id',isLoggedIn,catchAsync(campgroundControllers.showCampground));


router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgroundControllers.editCampground))

router.put('/:id',isLoggedIn,isAuthor,validateCampground, catchAsync(campgroundControllers.updateCampground))

router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campgroundControllers.deleteCampground))


module.exports = router;