const express = require("express");
const router = express.Router();
const cors = require("cors");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.post("/signup", authController.signUpUser);
router.post("/login", authController.loginUser);
router.get("/profile", authController.getProfile);
router.post("/changeUsername", authMiddleware, authController.changeUsername);
router.post("/changePassword", authMiddleware, authController.changePassword);

module.exports = router;