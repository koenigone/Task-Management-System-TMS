const db = require("../config/db");

// generate 8 digits ID for users
const generateListID = () => {
  return Math.floor(Math.random() * 90000000) + 10000000;
};

const createTaskList = async (req, res) => {
  try {
    const listID = generateListID();
    const userID = req.user.id; // Use the user ID from the decoded token
    const { listName, listDueDate } = req.body;
    const createdDate = new Date().toISOString().split("T")[0];
    const groupID = null;

    if (!listName || !listDueDate) {
      return res.json({ errMessage: "Fields cannot be empty" });
    }

    const createListQuery =
      "INSERT INTO TaskList (List_ID, User_ID, ListName, CreatedDate, Group_ID) VALUES (?, ?, ?, ?, ?)";

    db.run(
      createListQuery,
      [listID, userID, listName, createdDate, groupID],
      function (error) {
        if (error) {
          return res.json({
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
    console.log(error);
  }
};

const getTaskList = (req, res) => {
  try {
    const userID = req.user.id; // Use the user ID from the decoded token

    // Query to fetch task lists for the user
    const getListQuery =
      "SELECT * FROM TaskList WHERE User_ID = ? AND Group_ID IS NULL";

    db.all(getListQuery, [userID], (error, taskLists) => {
      if (error) {
        return res.json({
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
              resolve({ ...taskList, tasks });
            }
          });
        });
      });

      // Wait for all tasks to be fetched and combine the results
      Promise.all(fetchTasksForTaskLists)
        .then((taskListsWithTasks) => {
          res.json({ taskLists: taskListsWithTasks });
        })
        .catch((error) => {
          res.json(error);
        });
    });
  } catch (error) {
    console.error("Error retrieving task lists:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

const createTask = async (req, res) => {
  try {
    const taskID = generateListID();
    const userID = req.user.id; // Use the user ID from the decoded token
    const { listID, taskDesc, taskPriority, taskDueDate } = req.body;
    const priorityToNum = Number(taskPriority); // Convert to number
    const status = 0;

    if (!taskDesc || !priorityToNum || !taskDueDate) {
      return res.json({ errMessage: "Fields cannot be empty" });
    }

    const createListQuery =
      "INSERT INTO Task (Task_ID, User_ID, List_ID, Task_Desc, Task_Priority, Task_Status, Task_DueDate) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.run(
      createListQuery,
      [taskID, userID, listID, taskDesc, priorityToNum, taskDueDate, status],
      function (error) {
        if (error) {
          return res.json({
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
    console.log(error);
  }
};

module.exports = {
  createTaskList,
  getTaskList,
  createTask,
};