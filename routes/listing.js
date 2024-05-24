const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../schema.js");
const { isLoggedIn , isOwner , validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer'); 
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });  // file save kaha hogi


// Using router.route()
router.route("/")
.get(wrapAsync(listingController.index))                                 // Index Route
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.create)); // Create Route
// .post(upload.single('listing[image]'), (req,res) => {  // req.file is the `listing[image]` file
//     // res.send(req.body);
//     res.send(req.file);
// });

router.get("/new", isLoggedIn, listingController.new);  // New Route
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.edit));  // Edit Route

router.route("/:id")
.put(isOwner, isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.update))  // Update Route
.get(wrapAsync(listingController.show))                                          // Show Route
.delete(isOwner, isLoggedIn, wrapAsync(listingController.delete));               // Delete Route

/*
// Without router.route()
// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.new);

// Edit Route
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.edit));

// Update Route
router.put("/:id", isOwner, isLoggedIn, validateListing, wrapAsync(listingController.update));

// Show Route
router.get("/:id", wrapAsync(listingController.show));

// Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.create));

// Delete Route
router.delete("/:id", isOwner, isLoggedIn, wrapAsync(listingController.delete));
*/

module.exports = router;