const express = require("express");
const router = express.Router();
const cors = require("cors");
<<<<<<< HEAD
const {
  createTaskList,
  getTaskList,
  createTask,
} = require("../controllers/taskController");
=======
const { createTaskList, getTaskList, createTask } = require("../controllers/taskController");
>>>>>>> fa3d1366f734b07c57a56be8c2eb65acdddc1653

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
router.get("/createTask", createTask);

// Task related
router.post("/createTask", createTask);

module.exports = router;
