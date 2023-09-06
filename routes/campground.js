const express = require('express')
const router = express.Router();
const catchAsync =require('../utils/catchAsync')
const campgroundControllers = require('../controllers/campground')
const Campground = require('../models/campground')
const{isLoggedIn, isAuthor, validateCampground}  = require('../middleware/middleware')
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage});



router.route('/')
    .get(catchAsync(campgroundControllers.index))
    .post(isLoggedIn , upload.array('image'),validateCampground ,catchAsync(campgroundControllers.createCampground))



router.get('/new',isLoggedIn, campgroundControllers.getnewForm);

router.route('/:id')
    .get(isLoggedIn,catchAsync(campgroundControllers.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground, catchAsync(campgroundControllers.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgroundControllers.deleteCampground))



router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgroundControllers.editCampground))



module.exports = router;