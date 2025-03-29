const db = require("../config/db");
const helpers = require("../helpers/generateID");

const createGroup = async (req, res) => {
  try {
    const groupID = helpers.generateEightDigitID();
    const userID = req.user.id;
    const { groupName } = req.body;
    const createdDate = new Date().toISOString().split("T")[0];
    const isActive = true;

    if (!groupName) {
      return res.json({ errMessage: "Fields cannot be empty" });
    }

    if (groupName.length < 5 || groupName.length > 24) {
      return res.json({
        errMessage:
          "Group name should be more than 4 and less than 25 characters!",
      });
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

const getGroupMembers = (req, res) => {
  try {
    const { groupID } = req.query;
    const getGroupMembersQuery = `
      SELECT gm.User_ID, gm.User_Username, gm.JoinDate 
      FROM GroupMember gm
      WHERE gm.Group_ID = ?
    `;

    db.all(getGroupMembersQuery, [groupID], (error, members) => {
      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({ errMessage: "Database error" });
      }
      res.json({ members });
    });
  } catch (error) {
    console.error("Error retrieving group members:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

const removeGroupMember = (req, res) => {
  try {
    const { groupID, userID } = req.body;
    const removeMemberQuery =
      "DELETE FROM GroupMember WHERE Group_ID = ? AND User_ID = ?";

    db.run(removeMemberQuery, [groupID, userID], function (removeError) {
      if (removeError) {
        console.error("Database error:", removeError);
        return res.status(500).json({ errMessage: "Failed to remove member" });
      }

      if (this.changes === 0) {
        return res
          .status(404)
          .json({ errMessage: "Member not found in group" });
      }

      res.json({ success: true, message: "Member removed successfully" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

const assignTaskListToMember = (req, res) => {
  try {
    const { listID, userID, groupID } = req.body;
    const requesterID = req.user.id;

    // Verify requester is group admin
    const verifyAdminQuery = "SELECT User_ID FROM Groups WHERE Group_ID = ?";

    db.get(verifyAdminQuery, [groupID], (adminError, group) => {
      if (adminError) {
        console.error("Database error:", adminError);
        return res.status(500).json({ errMessage: "Database error" });
      }

      if (!group || group.User_ID !== requesterID) {
        return res
          .status(403)
          .json({ errMessage: "Only group admin can assign tasks" });
      }

      // Check if user is already assigned
      const checkAssignmentQuery = `
        SELECT * FROM TaskListMembers 
        WHERE List_ID = ? AND User_ID = ?
      `;

      db.get(checkAssignmentQuery, [listID, userID], (checkError, existing) => {
        if (checkError) {
          console.error("Database error:", checkError);
          return res.status(500).json({ errMessage: "Database error" });
        }

        if (existing) {
          return res.json({
            message: "User already has access to this task list",
          });
        }

        // Assign the task list
        const assignmentID = helpers.generateEightDigitID();
        const assignQuery = `
          INSERT INTO TaskListMembers 
            (TaskListMembers_ID, User_ID, List_ID) 
          VALUES (?, ?, ?)
        `;

        db.run(assignQuery, [assignmentID, userID, listID], (assignError) => {
          if (assignError) {
            console.error("Database error:", assignError);
            return res
              .status(500)
              .json({ errMessage: "Failed to assign task list" });
          }
          res.json({
            success: true,
            message: "Task list assigned successfully",
          });
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

const getUserJoinedGroups = async (req, res) => {
  try {
    const userId = req.params.userId;

    const getUserJoinedGroupsQuery = `
      SELECT g.Group_ID, g.GroupName, g.CreatedDate, g.IsActive, gm.JoinDate
      FROM Groups g
      JOIN GroupMember gm ON g.Group_ID = gm.Group_ID
      WHERE gm.User_ID = ?
    `;

    db.all(getUserJoinedGroupsQuery, [userId], (error, rows) => {
      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({
          error: "Failed to fetch joined groups",
          details: error.message,
        });
      }

      console.log(`Found ${rows.length} groups for user ${userId}`);
      res.json({ groups: rows });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch joined groups" });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  getGroupMembers,
  removeGroupMember,
  assignTaskListToMember,
  getUserJoinedGroups,
};