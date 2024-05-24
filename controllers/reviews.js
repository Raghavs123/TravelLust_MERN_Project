const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.postReview = async (req,res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;  // if the user is logged in then req.user will have all info of the user like it's id
    // console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created Successfully!!!");
    console.log("new review saved");
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted Successfully!!!");
    res.redirect(`/listings/${id}`);
};