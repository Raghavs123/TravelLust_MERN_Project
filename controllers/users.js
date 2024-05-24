const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

// Render Sign Up Form
module.exports.renderSignUpForm = (req,res) =>{
    res.render("users/signup.ejs");
};

// User Sign Up
module.exports.userSignUp = async (req,res) =>{
    try{
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
    
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        
        // Logged In automatically after Sign Up
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }

            req.flash("success", "Welcome to TravelLust!!!");
            res.redirect("/listings");
        });

        // req.flash("success", "Welcome to TravelLust!!!");
        // res.redirect("/listings");        
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Render Login Form 
module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

// User Login
// Below code is for Login successful ho jaaye uske baad kya krna h
// Since actual Login to passport krwa rha h
module.exports.userLogin = async (req,res) =>{
    req.flash("success", "Welcome back to TravelLust!!!")
    // res.redirect("/listings");
    // res.redirect(req.session.redirectUrl);

    // checking whether res.locals.redirectUrl exists or not, if not then assign "/listings" to redirectUrl
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// User Logout
module.exports.userLogOut = (req,res) => {
    req.logout((err) =>{
        if(err){
            return next(err);
        }

        req.flash("success", "You Logged Out Successfully!!!");
        res.redirect("/listings");
    });
};
