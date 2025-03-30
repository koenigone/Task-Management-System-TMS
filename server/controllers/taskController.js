const db = require("../config/db");
const helpers = require("../helpers/generateID");

// Create a new task list
const createTaskList = async (req, res) => {
  try {
    const listID = helpers.generateEightDigitID();
    const userID = req.user.id;
    const { listName, groupID } = req.body;
    const createdDate = new Date().toISOString().split("T")[0];

    if (!listName) {
      return res.status(400).json({ errMessage: "List name cannot be empty" });
    }

    // If groupID is provided, verify the user is the group creator
    if (groupID) {
      const checkGroupQuery = "SELECT User_ID FROM Groups WHERE Group_ID = ?";

      db.get(checkGroupQuery, [groupID], (err, group) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ errMessage: "Database error" });
        }

        if (!group || group.User_ID !== userID) {
          return res.status(403).json({ errMessage: "Only the group creator can create task lists for this group" });
        }

        insertTaskList(listID, userID, listName, createdDate, groupID, res);
      });
    } else {

      insertTaskList(listID, userID, listName, createdDate, null, res);
    }
  } catch (error) {
    console.error("Error creating task list:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

// Helper function to insert task list into the database
const insertTaskList = (listID, userID, listName, createdDate, groupID, res) => {
  const createListQuery =
    "INSERT INTO TaskList (List_ID, User_ID, ListName, CreatedDate, Group_ID) VALUES (?, ?, ?, ?, ?)";

  db.run(createListQuery, [listID, userID, listName, createdDate, groupID], function (error) {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ errMessage: "Database error", error: error.message });
    }

    res.json({ message: "List created successfully" });
  });
};


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

      // Fetch tasks and members for each task list
      const fetchTasksAndMembersForTaskLists = taskLists.map((taskList) => {
        return new Promise((resolve, reject) => {
          // Fetch tasks for the task list
          const getTasksQuery = "SELECT * FROM Task WHERE List_ID = ?";
          db.all(getTasksQuery, [taskList.List_ID], (error, tasks) => {
            if (error) {
              reject({ errMessage: "Database error", error: error.message });
            } else {
              // Calculate completed tasks and progress percentage
              const totalTasks = tasks?.length || 0;
              const completedTasks = tasks?.filter(task => task.Task_Status === 1).length || 0;
              const progressPercentage = totalTasks > 0 
                ? Math.round((completedTasks / totalTasks) * 100) 
                : 0;

              // Fetch members for the task list
              const getMembersQuery = `
                SELECT User.User_Username
                FROM TaskListMembers
                JOIN User ON TaskListMembers.User_ID = User.User_ID
                WHERE TaskListMembers.List_ID = ?
              `;
              db.all(getMembersQuery, [taskList.List_ID], (error, members) => {
                if (error) {
                  reject({ errMessage: "Database error", error: error.message });
                } else {
                  // Attach tasks, members, and progress data to the task list
                  resolve({
                    ...taskList,
                    tasks: tasks || [],
                    members: members || [],
                    progress: {
                      totalTasks,
                      completedTasks,
                      percentage: progressPercentage
                    }
                  });
                }
              });
            }
          });
        });
      });

      // Resolve all promises and return the result
      Promise.all(fetchTasksAndMembersForTaskLists)
        .then((taskListsWithTasksAndMembers) => {
          res.json({ taskLists: taskListsWithTasksAndMembers });
        })
        .catch((error) => {
          res.status(500).json({
            errMessage: "Error fetching tasks or members",
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
    const taskID = helpers.generateEightDigitID();
    const userID = req.user.id; // Use the user ID from the decoded token
    const { listID, taskDesc, taskPriority, taskDueDate } = req.body;
    const priorityToNum = Number(taskPriority); // Convert to number
    const status = 0; // Default status (e.g., 0 = Not Started)

    // Check for required fields
    if (!taskDesc || !priorityToNum || !taskDueDate) {
      return res.status(400).json({ errMessage: "Fields cannot be empty" });
    }

    // Check if the user is the creator of the list
    const getListCreatorQuery = "SELECT User_ID FROM TaskList WHERE List_ID = ?";
    db.get(getListCreatorQuery, [listID], (error, list) => {
      if (error) {
        console.error("Database error:", error.message);
        return res.status(500).json({ errMessage: "Database error" });
      }

      if (!list) {
        return res.status(404).json({ errMessage: "Task list not found" });
      }

      if (userID !== list.User_ID) {
        return res.status(403).json({ errMessage: "You are not authorized to add tasks to this list" });
      }

      // Proceed with inserting the task if the user is the list creator
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
          res.json({ message: "Task added successfully!" });
        }
      );
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

const markTaskAsComplete = (req, res) => {
  try {
    const { taskID } = req.body;

    // Step 1: Fetch the current status of the task
    const getTaskStatusQuery = "SELECT Task_Status FROM Task WHERE Task_ID = ?;";
    db.get(getTaskStatusQuery, [taskID], (error, row) => {
      if (error) {
        return res.status(500).json({
          errMessage: "Database error",
          error: error.message,
        });
      }

      if (!row) {
        return res.status(404).json({ errMessage: "Task not found" });
      }

      const currentStatus = row.Task_Status;
      const newStatus = currentStatus === 0 ? 1 : 0;
      
      const updateTaskStatusQuery = "UPDATE Task SET Task_Status = ? WHERE Task_ID = ?;";
      db.run(updateTaskStatusQuery, [newStatus, taskID], function (error) {
        if (error) {
          return res.status(500).json({
            errMessage: "Database error",
            error: error.message,
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({ errMessage: "Task not found" });
        }

        res.json({
          message: `Task state updated to ${newStatus === 1 ? "Completed" : "Pending"}`,
          newStatus: newStatus,
        });
      });
    });
  } catch (error) {
    console.error("Error changing task state", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

const getTaskListMembers = async (req, res) => {
  try {

  } catch (error) {
    console.error("Error finding users:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

const deleteTaskList = async (req, res) => {
  try {
    const { listID } = req.body;
    const userID = req.user.id; // Current user's ID

    // First, check if the current user is the creator of the task list
    const checkOwnerQuery = "SELECT User_ID FROM TaskList WHERE List_ID = ?";
    db.get(checkOwnerQuery, [listID], (error, row) => {
      if (error) {
        console.error("Error checking task list owner:", error);
        return res.status(500).json({ errMessage: "Error checking task list owner" });
      }

      // If no task list is found
      if (!row) {
        return res.status(404).json({ errMessage: "Task list not found" });
      }

      // If the user is not the creator
      if (row.User_ID !== userID) {
        return res.status(403).json({ errMessage: "You are not authorized to delete this task list" });
      }

      // First delete all tasks in the list
      const deleteTasksQuery = "DELETE FROM Task WHERE List_ID = ?";
      db.run(deleteTasksQuery, [listID], function(error) {
        if (error) {
          console.error("Error deleting tasks:", error);
          return res.status(500).json({ errMessage: "Error deleting tasks" });
        }

        // Then delete all list members
        const deleteMembersQuery = "DELETE FROM TaskListMembers WHERE List_ID = ?";
        db.run(deleteMembersQuery, [listID], function(error) {
          if (error) {
            console.error("Error deleting list members:", error);
            return res.status(500).json({ errMessage: "Error deleting list members" });
          }

          // Finally delete the list itself
          const deleteListQuery = "DELETE FROM TaskList WHERE List_ID = ?";
          db.run(deleteListQuery, [listID], function(error) {
            if (error) {
              console.error("Error deleting task list:", error);
              return res.status(500).json({ errMessage: "Error deleting task list" });
            }

            res.json({ message: "Task list and all related data deleted successfully" });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error deleting task list:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

module.exports = {
  createTaskList,
  getTaskList,
  createTask,
  markTaskAsComplete,
  getTaskListMembers,
  deleteTaskList,
};
