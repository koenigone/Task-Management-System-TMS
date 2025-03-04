const db = require("../config/db");

// generate 8 digits ID for users
const generateGroupID = () => {
  return Math.floor(Math.random() * 90000000) + 10000000;
};

const createGroup = async (req, res) => {
  try {
    const groupID = generateGroupID();
    const userID = req.user.id; // Use the user ID from the decoded token
    const { groupName } = req.body;
    const createdDate = new Date().toISOString().split("T")[0];
    const isActive = true;

    if (!groupName) {
      return res.json({ errMessage: "Fields cannot be empty" });
    }

    if (groupName.length < 5 || groupName.length > 24) {
      return res.json({ errMessage: "Group name should be more than 4 and less than 25 characters!" });
    }

    const createGroupQuery =
      "INSERT INTO Groups (Group_ID, GroupName, CreatedDate, User_ID, IsActive) VALUES (?, ?, ?, ?, ?)";

    db.run(
      createGroupQuery,
      [groupID, groupName, createdDate, userID, isActive],
      function (error) {
        if (error) {
          return res.json({
            errMessage: "Database error",
            error: error.message,
          });
        }
        res.json({
          message: "Group created successfully",
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const getMyGroups = (req, res) => {
  try {
    const userID = req.user.id;
    const getMyGroupsQuery = "SELECT * FROM Groups WHERE User_ID = ?";

    db.all(getMyGroupsQuery, [userID], (error, groups) => {
      if (error) {
        return res.status(500).json({
          errMessage: "Database error",
          error: error.message,
        });
      }

      // Send the fetched groups back to the client
      res.json({ groups });
    });
  } catch (error) {
    console.error("Error retrieving your groups:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

const getGroupTaskList = (req, res) => {
  try {
    const userID = req.user.id; // Use the user ID from the decoded token
    const groupID = req.params.groupID;

    // Query to fetch task lists for the user
    const getGroupListQuery =
      "SELECT * FROM TaskList WHERE User_ID = ? AND Group_ID = ?";

    db.all(getGroupListQuery, [userID, groupID], (error, groupTaskLists) => {
      if (error) {
        return res.json({
          errMessage: "Database error",
          error: error.message,
        });
      }

      // If no task lists are found, return an empty array
      if (!groupTaskLists || taskLists.length === 0) {
        return res.json({ groupTaskLists: [] });
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
    console.error("Error retrieving group task lists:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

module.exports = { createGroup, getMyGroups, getGroupTaskList };
