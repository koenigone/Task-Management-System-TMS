const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  test,
  signUpUser,
  loginUser,
  getProfile,
  changeUsername,
  changePassword
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.get("/", test);
router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.post("/changeUsername", authMiddleware, changeUsername);
router.post("/changePassword", authMiddleware, changePassword);

module.exports = router;
