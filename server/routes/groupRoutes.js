const express = require("express");
const router = express.Router();
const cors = require("cors");
const { createGroup, getMyGroups } = require("../controllers/groupController");
const authMiddleware = require("../middleware/authMiddleware");

// middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Task list related
router.post("/createGroup", authMiddleware, createGroup);
router.get("/getMyGroups", authMiddleware, getMyGroups);

module.exports = router;