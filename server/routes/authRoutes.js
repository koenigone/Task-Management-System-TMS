const express = require("express");
const { signUp } = require("../controllers/authController"); // Import controller

const router = express.Router();

router.post("/signup", signUp); // Route for signup

module.exports = router;