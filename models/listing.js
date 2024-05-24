const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description: String,
    image:{
        // type: String,
        // default: "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?cs=srgb&dl=pexels-pixabay-531880.jpg&fm=jpg",
        // set: (v) => v === "" ? "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?cs=srgb&dl=pexels-pixabay-531880.jpg&fm=jpg" : v

        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

// post Mongoose Middleware (It gets executed when delete route is called when a listing is deleted)
// To delete all related reviews for particular listing, when a listing is deleted
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){  // agar koi listing aayi h/exist krti h tabhi below operation ko perform krna
        await Review.deleteMany({_id : {$in: listing.reviews}});  // wo saare reviews ko delete kr do jo listing ke reviews array me h
    }
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;