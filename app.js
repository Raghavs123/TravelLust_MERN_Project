if(process.env.NODE_ENV != "production"){
    require('dotenv').config()    
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema , reviewSchema } = require("./schema.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/travellust";

main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
})

async function main(){
    mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // one week baad ka time in milliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true  // security purpose (cross-scripting attacks)
    }
};

// app.get("/", (req,res)=>{
//     res.send("Welcome to TravelLust!!!");
// });

app.use(session(sessionOptions));
app.use(flash());  // To be used before routes

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());     // To serialize user
passport.deserializeUser(User.deserializeUser()); // To deserialize user

// Middleware which works just after incoming request & before sending response
app.use((req,res,next) => {
    res.locals.success = req.flash("success");  // This success variable will be accessed in flash.ejs (success flash is trigerred)
    res.locals.error = req.flash("error");  // This error variable will be accessed in flash.ejs (error flash is trigerred)
    // console.log(res.locals.success);

    res.locals.currUser = req.user;
    next();  // important
});

// To create a new user to be stored in Database
// app.get("/demo", async (req,res) =>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//    let registeredUser = await User.register(fakeUser, "helloworld");  // To register a new user with given password
//    res.send(registeredUser);
// });

app.use("/listings", listingRouter);   // listings routes ke liye single line 
app.use("/listings/:id/reviews", reviewRouter); // reviews routes ke liye single line 
app.use("/", userRouter); 

// app.get("/testlisting", async (req,res) => { 
//     let sampleListing = new Listing({
//         title: "My Home",
//         description: "Near Beach",
//         price: 1000,
//         location: "Indore",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("sample listing was saved");
//     res.send("successful testing");
// });

// To display error message when any arbitrary route is been entered apart from above routes
// Common middleware for rest all routes apart from above mentioned routes
app.all("*", (req,res,next) =>{
    next(new ExpressError(404, "Page not found!"));
});

// The above error will be catched by below middleware/ExpressError

// Middleware to handle error
app.use((err,req,res,next) => {
    let { statusCode = 500, message = "something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
    // res.send("something went wrong!");
});

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});