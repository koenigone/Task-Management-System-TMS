const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  createTaskList,
  getTaskList,
  createTask,
} = require("../controllers/taskController");

// middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Task list related
router.post("/createTaskList", createTaskList);
router.get("/getTaskList", getTaskList);

// Task related
router.post("/createTask", createTask);

module.exports = router;
