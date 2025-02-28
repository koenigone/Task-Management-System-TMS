const express = require("express");
const router = express.Router();
const cors = require("cors");
const { createTaskList, getTaskList, createTask } = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

// middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Task list related
router.post("/createTaskList", authMiddleware, createTaskList);
router.get("/getTaskList", authMiddleware, getTaskList);
router.post("/createTask", authMiddleware, createTask);

module.exports = router;