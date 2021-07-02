const express = require('express');
const router = express.Router();
const {campgroundSchema} = require('../schemas');
const ExpressError=require('../utils/ExpressError');
const campgroundController = require('../controllers/Campgrounds');
const catchAsync = require('../utils/catchAsync');
const campground = require('../models/campground');
const multer  = require('multer')
const upload = multer()
const {isLoggedIn,isAuthor, validateCampground} =require('../middleware');


router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgroundController.createCampground));

router.get('/new',isLoggedIn, campgroundController.renderNewForm);

router.route('/:id')
   .get(catchAsync(campgroundController.showCampground))
   .put(isLoggedIn,isAuthor, validateCampground, catchAsync(campgroundController.updateCampground))
   .delete(isLoggedIn,isAuthor, catchAsync(campgroundController.deleteCampground))
   
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgroundController.renderEditForm));


module.exports=router;
