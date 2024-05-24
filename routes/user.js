const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


// Using router.route()
router.route("/signup")
.get(userController.renderSignUpForm)  // Render Sign Up Form
.post(wrapAsync(userController.userSignUp));  // User Sign Up

router.route("/login")
.get(userController.renderLoginForm)  // Render Login Form
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true }), userController.userLogin);  // User Login

router.get("/logout", userController.userLogOut);  // User Log Out

/*
// Render Sign Up Form
router.get("/signup", userController.renderSignUpForm);

// User Sign Up
router.post("/signup", wrapAsync(userController.userSignUp));


// Render Login Form
router.get("/login", userController.renderLoginForm);

// User Login
// User Authentication is required here i.e user pehle se Database me tha ya nhi 
// passport will do this work for us as a middleware passport.authenticate() 
// if passport.authenticate() middleware is passed successfully, then only further operation (callback) of below route would take place
router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true }), userController.userLogin);

// User Log Out
router.get("/logout", userController.userLogOut);
*/

module.exports = router;
