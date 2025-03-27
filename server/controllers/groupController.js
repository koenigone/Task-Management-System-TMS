const db = require("../config/db");

// generate 8 digits ID for users
const generateGroupID = () => {
  return Math.floor(Math.random() * 90000000) + 10000000;
};

const generateGroupMemberID = () => {
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

module.exports = { createGroup, getMyGroups, getGroupMembers, removeGroupMember };
