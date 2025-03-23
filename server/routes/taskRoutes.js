const express = require("express");
const router = express.Router();
const cors = require("cors");
const TasksController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

// middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Task list related
router.post("/createTaskList", authMiddleware, TasksController.createTaskList);
router.get("/getTaskList", authMiddleware, TasksController.getTaskList);
router.post("/createTask", authMiddleware, TasksController.createTask);
router.get("/getTaskListMembers/:listId", authMiddleware, TasksController.getTaskListMembers);

module.exports = router;