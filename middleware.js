const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

// To authenticate user whether they are logged in or not
module.exports.isLoggedIn = (req,res,next) => {
    // console.log(req.user);
    // console.log(req.path , "..", req.originalUrl);

    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a new Listing!");
        return res.redirect("/login");
    }    
    next();
}

// redirectUrl se res.locals me redirectUrl ko save karana
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// Checks whether Current User is Actual Owner of our Listing or not
module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;

    // Authorization for Listings
    let listing = await Listing.findById(id);
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);    
    }    

    next();
}

// Checks whether Current User is Actual Author of our Review or not
module.exports.isReviewAuthor = async (req,res,next) => {
    let { id , reviewId } = req.params;

    // Authorization for Reviews
    let review = await Review.findById(reviewId);
    if(res.locals.currUser && !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);    
    }    

    next();
}

// Validate Listings
module.exports.validateListing = (req,res,next) =>{
    // let result = listingSchema.validate(req.body);
    let {error} = listingSchema.validate(req.body);  // De-constructing error instead of result as a whole object
    // console.log(error);

    if(error){
        // let errMsg = error.details.map((el) => el.message).join(","); // To combine or extract error properties
        throw new ExpressError(400, error);
    } else {  // if no error exists
        next();
    }
}

// Validate Reviews
module.exports.validateReview = (req,res,next) =>{
    // let result = reviewSchema.validate(req.body);
    let {error} = reviewSchema.validate(req.body);  // De-constructing error instead of result as a whole object
    // console.log(error);

    if(error){
        // let errMsg = error.details.map((el) => el.message).join(","); // To combine or extract error properties
        throw new ExpressError(400, error);
    } else {  // if no error exists
        next();
    }
}