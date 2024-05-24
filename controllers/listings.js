const Listing = require("../models/listing.js");

// Index Route
module.exports.index = async (req,res,next) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
};

// New Route
module.exports.new = (req,res) => {
    // console.log(req.user);
    res.render("./listings/new.ejs");
};

// Edit Route
module.exports.edit = async (req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);    

    if(!listing){
        req.flash("error", "Listing you requested for doesn't exists!!!");
        res.redirect("/listings");
    }

    // Image Preview in Edit Page (Extraz)
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_350");

    res.render("./listings/edit.ejs", {listing, originalImageUrl});
}

// Update Route
module.exports.update = async (req,res,next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }

    let { id } = req.params;

    // // Authorization for Listings
    // let listing = await Listing.findById(id);
    // if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error", "You don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);    
    // }

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    // Steps after Image Upload
    if(typeof req.file !== "undefined"){
        let url = req.file.path;            // extract url/path from req.file
        let filename = req.file.filename;   // extract filename from req.file
        listing.image = {url, filename};    // assign/set url,filename to image field of listing
        await listing.save();               // save the listing again with above changes        
    }

    req.flash("success", "Your Listing Updated Successfully!!!");
    res.redirect(`/listings/${id}`);    
};

// Show Route
module.exports.show = async (req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }}).populate("owner");  // listing ke reviews ko populate kr do with their details
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exists!!!");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", {listing}); 
};

// Create Route
module.exports.create = async (req,res,next) => {
    // let result = listingSchema.validate(req.body);  // using joi
    // console.log(result);

    // if(result.error){  // joi error
    //     throw new ExpressError(400, result.error);
    // }

    // Steps after Cloudinary Setup (Image Upload)
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);

    const newListing = new Listing(req.body.listing);    
    // // console.log(req.user);
    newListing.owner = req.user._id;  // To assign specific owner in owner property of listing who created that particular listing
    // // From now every new listing created will have it's own individual owner not the demo owner

    newListing.image = {url, filename};  // After Cloudinary Changes in listing schema

    await newListing.save();
    req.flash("success", "New Listing Created Successfully!!!");
    // console.log(newListing);
    res.redirect("/listings");
    // console.log(listing);        
};

// Delete Route
module.exports.delete = async (req,res,next) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!!!");
    res.redirect("/listings");
};