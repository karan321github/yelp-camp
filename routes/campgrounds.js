const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync  = require('../utils/catchAsync');
const {campgroundSchema , reviewSchema} = require('../schema.js')
const{ isLoggedIn , isAuthor ,validateCampground} = require('../middileware.js'); 
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const passport = require('passport');
const {} = require('../middileware.js');
const campground = require('../models/campground');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage })

 
router.route('/')
        .get( catchAsync(campgrounds.index))
        // .post(upload.array('image') , (req , res) => {
        //         console.log(req.body , req.files);
        //         res.send("it worked");
        // })
        .post(isLoggedIn , upload.array('image') , validateCampground , catchAsync(campgrounds.createCampground));
       

router.get('/new' ,  isLoggedIn , campgrounds.renderNewForm);


router.route('/:id')
        .get(catchAsync(campgrounds.showCampground))
        .put(isLoggedIn , isAuthor ,upload.array('image') , validateCampground ,  catchAsync(campgrounds.updateForm))
        .delete(isLoggedIn , isAuthor , catchAsync(campgrounds.deleteForm));

router.get('/:id/edit' ,isLoggedIn , isAuthor , catchAsync(campgrounds.renderEditForm));







module.exports = router;