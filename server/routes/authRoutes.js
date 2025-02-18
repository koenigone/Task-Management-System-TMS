const express = require("express");
const { signUp, Login } = require("../controllers/authController"); // Import controller

const router = express.Router();

router.post("/signup", signUp); // Route for signup page
router.post("/login", Login);   // Route for login page

module.exports = router;