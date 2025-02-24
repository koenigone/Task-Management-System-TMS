const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/jwt");

// generate 8 digits ID for users
const generateListID = () => {
  return Math.floor(Math.random() * 90000000) + 10000000;
};

const createTaskList = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ errMessage: "Unauthorized" });
    }

    // Verify and decode the token
    jwt.verify(token, jwtSecret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ errMessage: "Invalid token" });
      }

      const listID = generateListID();
      const userID = decoded.id;
      const { listName, listDueDate } = req.body;
      const createdDate = new Date().toISOString().split("T")[0];
      const groupID = null;

      if (!listName || !listDueDate) {
        return res.json({ errMessage: "Fields cannot be empty" });
      }

      const createListQuery =
        "INSERT INTO TaskList (List_ID, User_ID, ListName, DueDate, CreatedDate, Group_ID) VALUES (?, ?, ?, ?, ?, ?)";

      db.run(
        createListQuery,
        [listID, userID, listName, listDueDate, createdDate, groupID],
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
    });
  } catch (error) {
    console.log(error);
  }
};

const getTaskList = (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ errMessage: "Unauthorized" });
    }

    // Verify and decode the token
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ errMessage: "Invalid token" });
      }

      const userID = decoded.id; // Ensure it matches the key used in loginUser()
      const getListQuery = "SELECT * FROM TaskList WHERE User_ID = ? AND Group_ID IS NULL";

      db.all(getListQuery, [userID], (error, rows) => {
        if (error) {
          return res.json({
            errMessage: "Database error",
            error: error.message,
          });
        }
        
        res.json({ taskLists: rows }); // Return the fetched task lists
      });
    });
  } catch (error) {
    console.error("Error retrieving task lists:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

const createTask = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ errMessage: "Unauthorized" });
    }

    // Verify and decode the token
    jwt.verify(token, jwtSecret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ errMessage: "Invalid token" });
      }

      const taskID = generateListID();
      const userID = decoded.id;
      const { taskDesc, listDueDate } = req.body;
      const createdDate = new Date().toISOString().split("T")[0];
      const groupID = null;

      if (!listName || !listDueDate) {
        return res.json({ errMessage: "Fields cannot be empty" });
      }

      const createListQuery =
        "INSERT INTO TaskList (List_ID, User_ID, ListName, DueDate, CreatedDate, Group_ID) VALUES (?, ?, ?, ?, ?, ?)";

      db.run(
        createListQuery,
        [listID, userID, listName, listDueDate, createdDate, groupID],
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
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createTaskList, getTaskList, createTask };
