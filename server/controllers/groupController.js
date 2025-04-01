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

    // Fetch groups the user owns or is a member of
    const getMyGroupsQuery = `
      SELECT DISTINCT g.*
      FROM Groups g
      LEFT JOIN GroupMember gm ON g.Group_ID = gm.Group_ID
      WHERE g.User_ID = ? OR gm.User_ID = ?
    `;

    db.all(getMyGroupsQuery, [userID, userID], (error, groups) => {
      if (error) {
        return res.status(500).json({
          errMessage: "Database error",
          error: error.message,
        });
      }

      if (!groups || groups.length === 0) {
        return res.json({ groups: [] });
      }

      // Fetch task lists and members for each group
      const fetchDetailsForGroups = groups.map((group) => {
        return new Promise((resolve, reject) => {
          const getTaskListsQuery = `SELECT * FROM TaskList WHERE Group_ID = ?`;
          const getMembersQuery = `
            SELECT u.User_ID, u.User_Username
            FROM GroupMember gm
            JOIN User u ON gm.User_ID = u.User_ID
            WHERE gm.Group_ID = ?
          `;

          db.all(
            getTaskListsQuery,
            [group.Group_ID],
            (taskListError, taskLists) => {
              if (taskListError) {
                reject({
                  errMessage: "Database error",
                  error: taskListError.message,
                });
              } else {
                db.all(
                  getMembersQuery,
                  [group.Group_ID],
                  (memberError, members) => {
                    if (memberError) {
                      reject({
                        errMessage: "Database error",
                        error: memberError.message,
                      });
                    } else {
                      resolve({
                        ...group,
                        TaskLists: taskLists || [],
                        Members: members || [],
                      });
                    }
                  }
                );
              }
            }
          );
        });
      });

      // Resolve all promises and return the result
      Promise.all(fetchDetailsForGroups)
        .then((groupsWithDetails) => {
          res.json({ groups: groupsWithDetails });
        })
        .catch((error) => {
          res.status(500).json({
            errMessage: "Error fetching task lists or members",
            error: error.message,
          });
        });
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

      res.json({ groups: rows });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch joined groups" });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { groupID } = req.body;
    const userID = req.user.id; // Current user's ID

    // First, check if the current user is the creator of the group
    const checkOwnerQuery = "SELECT User_ID FROM Groups WHERE Group_ID = ?";
    db.get(checkOwnerQuery, [groupID], (error, row) => {
      if (error) {
        console.error("Error checking group owner:", error);
        return res.status(500).json({ errMessage: "Error checking group owner" });
      }

      // If no group is found
      if (!row) {
        return res.status(404).json({ errMessage: "Group not found" });
      }

      // If the user is not the creator
      if (row.User_ID !== userID) {
        return res.status(403).json({ errMessage: "Not authorized to delete this group" });
      }

      // First delete all task lists in the group
      const deleteListsQuery = "DELETE FROM TaskList WHERE Group_ID = ?";
      db.run(deleteListsQuery, [groupID], function(error) {
        if (error) {
          console.error("Error deleting task lists:", error);
          return res.status(500).json({ errMessage: "Error deleting task lists" });
        }

        // Then delete all group members
        const deleteMembersQuery = "DELETE FROM GroupMember WHERE Group_ID = ?";
        db.run(deleteMembersQuery, [groupID], function(error) {
          if (error) {
            console.error("Error deleting group members:", error);
            return res.status(500).json({ errMessage: "Error deleting group members" });
          }

          // Finally delete the group itself
          const deleteGroupQuery = "DELETE FROM Groups WHERE Group_ID = ?";
          db.run(deleteGroupQuery, [groupID], function(error) {
            if (error) {
              console.error("Error deleting group:", error);
              return res.status(500).json({ errMessage: "Error deleting group" });
            }

            res.json({ message: "Group and all related data deleted successfully" });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  getGroupMembers,
  removeGroupMember,
  assignTaskListToMember,
  getUserJoinedGroups,
  deleteGroup,
};
