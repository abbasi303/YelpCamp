const express = require('express')
const router = express.Router();
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const userController = require('../controllers/user')

router.get('/register',userController.renderRegister)

router.post('/register',catchAsync(userController.userRegister));


router.get('/login',userController.renderLogin)



router.post('/login',passport.authenticate('local',{failureFlash:true , failureRedirect:'/login'}),userController.userLogin)


router.get('/logout', userController.userLogout); 


module.exports = router;