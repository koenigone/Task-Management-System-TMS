const db = require("../config/db");

// Generate 8-digit ID for task lists and tasks
const generateID = () => {
  return Math.floor(Math.random() * 90000000) + 10000000;
};

// Create a new task list
const createTaskList = async (req, res) => {
  try {
    const listID = generateID();
    const userID = req.user.id; // Use the user ID from the decoded token
    const { listName, groupID } = req.body;
    const createdDate = new Date().toISOString().split("T")[0];

    // Check for required fields
    if (!listName) {
      return res.status(400).json({ errMessage: "List name cannot be empty" });
    }

    const createListQuery =
      "INSERT INTO TaskList (List_ID, User_ID, ListName, CreatedDate, Group_ID) VALUES (?, ?, ?, ?, ?)";

    db.run(
      createListQuery,
      [listID, userID, listName, createdDate, groupID || null], // Allow groupID to be null
      function (error) {
        if (error) {
          console.error("Database error:", error.message);
          return res.status(500).json({
            errMessage: "Database error",
            error: error.message,
          });
        }
        res.json({
          message: "List created successfully",
        });
      }
    );
  } catch (error) {
    console.error("Error creating task list:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

// Get all task lists for a user (optionally filtered by groupID)
const getTaskList = (req, res) => {
  try {
    const userID = req.user.id;
    const { Group_ID } = req.query;

    // Validate Group_ID if provided
    if (Group_ID !== undefined && Group_ID !== null && isNaN(Number(Group_ID))) {
      return res.status(400).json({
        errMessage: "Invalid Group_ID",
      });
    }

    // Base query to fetch task lists
    let getListQuery = `
      SELECT DISTINCT TaskList.*
      FROM TaskList
      LEFT JOIN TaskListMembers ON TaskList.List_ID = TaskListMembers.List_ID
      WHERE (TaskList.User_ID = ? OR TaskListMembers.User_ID = ?)
    `;
    const queryParams = [userID, userID];

    // Add Group_ID filter if provided
    if (Group_ID !== undefined && Group_ID !== null) {
      getListQuery += " AND TaskList.Group_ID = ?";
      queryParams.push(Group_ID);
    } else {
      // Fetch task lists without a group (Group_ID is NULL)
      getListQuery += " AND TaskList.Group_ID IS NULL";
    }

    // Fetch task lists
    db.all(getListQuery, queryParams, (error, taskLists) => {
      if (error) {
        return res.status(500).json({
          errMessage: "Database error",
          error: error.message,
        });
      }

      // If no task lists are found, return an empty array
      if (!taskLists || taskLists.length === 0) {
        return res.json({ taskLists: [] });
      }

      // Fetch tasks for each task list
      const fetchTasksForTaskLists = taskLists.map((taskList) => {
        return new Promise((resolve, reject) => {
          const getTasksQuery = "SELECT * FROM Task WHERE List_ID = ?";
          db.all(getTasksQuery, [taskList.List_ID], (error, tasks) => {
            if (error) {
              reject({ errMessage: "Database error", error: error.message });
            } else {
              // Attach tasks to the task list
              resolve({ ...taskList, tasks: tasks || [] });
            }
          });
        });
      });

      // Resolve all promises and return the result
      Promise.all(fetchTasksForTaskLists)
        .then((taskListsWithTasks) => {
          res.json({ taskLists: taskListsWithTasks });
        })
        .catch((error) => {
          res.status(500).json({
            errMessage: "Error fetching tasks",
            error: error.message,
          });
        });
    });
  } catch (error) {
    console.error("Error retrieving task lists:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const taskID = generateID();
    const userID = req.user.id; // Use the user ID from the decoded token
    const { listID, taskDesc, taskPriority, taskDueDate } = req.body;
    const priorityToNum = Number(taskPriority); // Convert to number
    const status = 0; // Default status (e.g., 0 = Not Started)

    // Check for required fields
    if (!taskDesc || !priorityToNum || !taskDueDate) {
      return res.status(400).json({ errMessage: "Fields cannot be empty" });
    }

    const createTaskQuery =
      "INSERT INTO Task (Task_ID, User_ID, List_ID, Task_Desc, Task_Priority, Task_Status, Task_DueDate) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.run(
      createTaskQuery,
      [taskID, userID, listID, taskDesc, priorityToNum, status, taskDueDate],
      function (error) {
        if (error) {
          console.error("Database error:", error.message);
          return res.status(500).json({
            errMessage: "Database error",
            error: error.message,
          });
        }
        res.json({
          message: "Task added successfully!",
        });
      }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

module.exports = {
  createTaskList,
  getTaskList,
  createTask,
};
