const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  createGroup,
  getMyGroups,
  getGroupTaskList,
} = require("../controllers/groupController");
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
router.get("/getGroupTaskLists", authMiddleware, getGroupTaskList);

module.exports = router;
