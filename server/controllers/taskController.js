const db = require("../config/db");
const helpers = require("../helpers/generateID");

// CREATE TASK LIST FUNCTION
/*
  This function is used to create a new task list
  It generates a unique list ID, user ID, list name, group ID, and created date
  It then checks if the list name is valid and if the user is the group creator
  It then inserts the task list into the database
  It then returns a success message
*/
const createTaskList = async (req, res) => {
  try {
    const listID = helpers.generateEightDigitID();
    const userID = req.user.id;
    const { listName, groupID } = req.body;
    const createdDate = new Date().toISOString().split("T")[0];

    if (!listName) {
      return res.status(400).json({ errMessage: "List name cannot be empty" });
    }

    if (listName.length < 5 || listName.length > 16) {
      return res.status(400).json({ errMessage: "List name should be more than 4 and less than 25 characters!" });
    }

    // If groupID is provided, verify the user is the group creator
    if (groupID) {
      const checkGroupQuery = "SELECT User_ID FROM Groups WHERE Group_ID = ?";

      db.get(checkGroupQuery, [groupID], (err, group) => {
        if (err) return res.status(500).json({ errMessage: "Database error" }); // check for error

        if (!group || group.User_ID !== userID) {
          return res.status(403).json({ errMessage: "Only the group creator can create task lists for this group" });
        }

        insertTaskList(listID, userID, listName, createdDate, groupID, res);
      });
    } else {
      insertTaskList(listID, userID, listName, createdDate, null, res);
    }
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// Helper function to insert task list into the database
const insertTaskList = (listID, userID, listName, createdDate, groupID, res) => {
  try {
    const createListQuery = "INSERT INTO TaskList (List_ID, User_ID, ListName, CreatedDate, Group_ID) VALUES (?, ?, ?, ?, ?)";

    db.run(createListQuery, [listID, userID, listName, createdDate, groupID], (error) => {
      if (error) return res.status(500).json({ errMessage: "Database error", error: error.message }); // check for error
      res.status(200).json({ message: "List created successfully" });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// GET TASK LIST FUNCTION
const getTaskList = (req, res) => {
  try {
    const userID = req.user.id;
    const { Group_ID } = req.query;

    // check if Group_ID is provided and is a valid number
    if (Group_ID !== undefined && Group_ID !== null && isNaN(Number(Group_ID))) {
      return res.status(400).json({ errMessage: "Invalid Group_ID" });
    }

    // base query to fetch task lists
    let getListQuery = `
      SELECT DISTINCT TaskList.*
      FROM TaskList
      LEFT JOIN TaskListMembers ON TaskList.List_ID = TaskListMembers.List_ID
      WHERE (TaskList.User_ID = ? OR TaskListMembers.User_ID = ?)
    `;
    const queryParams = [userID, userID];

    // add Group_ID filter if provided
    if (Group_ID !== undefined && Group_ID !== null) {
      getListQuery += " AND TaskList.Group_ID = ?";
      queryParams.push(Group_ID);
    } else {
      getListQuery += " AND TaskList.Group_ID IS NULL";
    }

    // retrieve task lists
    db.all(getListQuery, queryParams, (error, taskLists) => {
      if (error) {
        return res.status(500).json({ errMessage: "Database error", error: error.message }); // check for error
      }

      if (!taskLists || taskLists.length === 0) { // if no task lists are found, return an empty array
        return res.json({ taskLists: [] });
      }

      // Fetch tasks and members for each task list
      const fetchTasksAndMembersForTaskLists = taskLists.map((taskList) => {
        return new Promise((resolve, reject) => {
          const getTasksQuery = "SELECT * FROM Task WHERE List_ID = ?"; // fetch tasks for the task list
          db.all(getTasksQuery, [taskList.List_ID], (error, tasks) => {
            if (error) {
              reject({ errMessage: "Database error", error: error.message });
            } else { // if no error, calculate completed tasks and progress percentage
              const totalTasks = tasks?.length || 0;
              const completedTasks = tasks?.filter(task => task.Task_Status === 1).length || 0;
              const progressPercentage = totalTasks > 0 
                ? Math.round((completedTasks / totalTasks) * 100) 
                : 0;

              // retrieve members for the task list
              const getMembersQuery = `
                SELECT User.User_Username
                FROM TaskListMembers
                JOIN User ON TaskListMembers.User_ID = User.User_ID
                WHERE TaskListMembers.List_ID = ?
              `;
              db.all(getMembersQuery, [taskList.List_ID], (error, members) => {
                if (error) {
                  reject({ errMessage: "Database error", error: error.message });
                } else { // if no error, attach tasks, members, and progress data to the task list
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

      // resolve all promises and return the result
      Promise.all(fetchTasksAndMembersForTaskLists)
        .then((taskListsWithTasksAndMembers) => {
          res.status(200).json({ taskLists: taskListsWithTasksAndMembers });
        })
        .catch((error) => {
          res.status(500).json({ errMessage: "Error fetching tasks or members", error: error.message });
        });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// CREATE TASK FUNCTION
const createTask = async (req, res) => {
  try {
    const taskID = helpers.generateEightDigitID();
    const userID = req.user.id; // Use the user ID from the decoded token
    const { listID, taskDesc, taskPriority, taskDueDate } = req.body;
    const priorityToNum = Number(taskPriority); // Convert to number
    const status = 0; // Default status (e.g., 0 = Not Started)

    // Check for required fields
    if (!taskDesc || !priorityToNum) {
      return res.status(400).json({ errMessage: "Fields cannot be empty" });
    }

    // Check if the user is the creator of the list
    const getListCreatorQuery = "SELECT User_ID FROM TaskList WHERE List_ID = ?";
    db.get(getListCreatorQuery, [listID], (error, list) => {
      if (error) return res.status(500).json({ errMessage: "Database error" });       // check for error
      if (!list) return res.status(404).json({ errMessage: "Task list not found" });  // check if list exists
      if (userID !== list.User_ID) return res.status(403).json({ errMessage: "You are not authorized to add tasks to this list" });

      // proceed with inserting the task if the user is the list creator
      const createTaskQuery = "INSERT INTO Task (Task_ID, User_ID, List_ID, Task_Desc, Task_Priority, Task_Status, Task_DueDate) VALUES (?, ?, ?, ?, ?, ?, ?)";

      db.run(createTaskQuery, [taskID, userID, listID, taskDesc, priorityToNum, status, taskDueDate], (error) => {
        if (error) return res.status(500).json({ errMessage: "Database error", error: error.message });
        res.status(200).json({ message: "Task added successfully!" });
      });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// MARK TASK AS COMPLETE FUNCTION
const markTaskAsComplete = (req, res) => {
  try {
    const { taskID } = req.body;
    const getTaskStatusQuery = "SELECT Task_Status FROM Task WHERE Task_ID = ?;";
    db.get(getTaskStatusQuery, [taskID], (error, row) => {
      if (error) return res.status(500).json({ errMessage: "Database error", error: error.message });  // check for error
      if (!row) return res.status(404).json({ errMessage: "Task not found" });                        // check if task exists

      const currentStatus = row.Task_Status;
      const newStatus = currentStatus === 0 ? 1 : 0;
      
      const updateTaskStatusQuery = "UPDATE Task SET Task_Status = ? WHERE Task_ID = ?;";
      db.run(updateTaskStatusQuery, [newStatus, taskID], (error) => {
        if (error) return res.status(500).json({ errMessage: "Database error", error: error.message });
        if (this.changes === 0) return res.status(404).json({ errMessage: "Task not found" });

        res.json({ message: `Task state updated to ${newStatus === 1 ? "Completed" : "Pending"}` });
      });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

const deleteTaskList = async (req, res) => {
  try {
    const { listID } = req.body;
    const userID = req.user.id; // Current user's ID

    const checkOwnerQuery = "SELECT User_ID FROM TaskList WHERE List_ID = ?";
    db.get(checkOwnerQuery, [listID], (error, row) => { // check if the user is the owner of the task list
      if (error) return res.status(500).json({ errMessage: "Database error", error: error.message });
      if (!row) return res.status(404).json({ errMessage: "Task list not found"});                                                // check if task list exists
      if (row.User_ID !== userID) return res.status(403).json({ errMessage: "You are not authorized to delete this task list" }); // check if owner
      
      const deleteTasksQuery = "DELETE FROM Task WHERE List_ID = ?";
      db.run(deleteTasksQuery, [listID], (error) => { // delete tasks
        if (error) return res.status(500).json({ errMessage: "Database error", error: error.message });

        const deleteMembersQuery = "DELETE FROM TaskListMembers WHERE List_ID = ?";
        db.run(deleteMembersQuery, [listID], (error) => { // delete members
          if (error) return res.status(500).json({ errMessage: "Database error", error: error.message });

          const deleteListQuery = "DELETE FROM TaskList WHERE List_ID = ?"; 
          db.run(deleteListQuery, [listID], (error) => { // delete list
            if (error) return res.status(500).json({ errMessage: "Database error", error: error.message });
          
            res.status(200).json({ message: "Task list and all related data deleted successfully" });
          });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// Leave Task List FUNCTION
const leaveTaskList = async (req, res) => {
  try {
    const { listID } = req.body;
    const userID = req.user.id;

    const checkMemberQuery = "SELECT User_ID FROM TaskListMembers WHERE List_ID = ? AND User_ID = ?";
    db.get(checkMemberQuery, [listID, userID], (error, row) => {
      if (error) return res.status(500).json({ errMessage: "Database error", error: error.message });
      if (!row) return res.status(404).json({ errMessage: "You are not a member of this task list" });

      const deleteMemberQuery = "DELETE FROM TaskListMembers WHERE List_ID = ? AND User_ID = ?";
      db.run(deleteMemberQuery, [listID, userID], (error) => {
        if (error) return res.status(500).json({ errMessage: "Database error", error: error.message });
        res.status(200).json({ message: "Successfully left the task list" });
      });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

module.exports = {
  createTaskList,
  getTaskList,
  createTask,
  markTaskAsComplete,
  deleteTaskList,
  leaveTaskList,
};