const { campgroundSchema, reviewSchema } = require('./schema');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');



module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    
    // Check if user is authenticated and campground author matches the logged-in user
    if (!req.user || !campground.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to do that');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next(); // User is authorized, proceed to the next middleware/route handler
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req , res , next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
    } else {
         next();
    }
}

