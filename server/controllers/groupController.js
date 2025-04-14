const db = require("../config/db");
const helpers = require("../helpers/generateID");

// CREATE GROUP FUNCTION
const createGroup = async (req, res) => {
  try {
    const groupID = helpers.generateEightDigitID();
    const userID = req.user.id;
    const { groupName } = req.body;
    const createdDate = new Date().toISOString().split("T")[0];
    const isActive = true;

    // validate group creation inputs
    if (!groupName) {
      return res.json({ errMessage: "Fields cannot be empty" });
    }

    if (groupName.length < 5 || groupName.length > 19) {
      return res.json({
        errMessage:
          "Group name should be more than 4 and less than 25 characters!",
      });
    }

    const createGroupQuery ="INSERT INTO Groups (Group_ID, GroupName, CreatedDate, User_ID, IsActive) VALUES (?, ?, ?, ?, ?)";

    db.run(createGroupQuery, [groupID, groupName, createdDate, userID, isActive], (error) => {
      if (error) return res.json({ errMessage: "Database error", error: error.message }); // check for error
      res.json({ message: "Group created successfully" });                                // send success message
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// Helper function to fetch task lists and members for groups
const fetchGroupDetails = (groups, res, isArray = true) => {
  if (!groups || (isArray && groups.length === 0)) {
    return res.json({ groups: isArray ? [] : null });
  }

  const groupsArray = isArray ? groups : [groups];           // convert single group to array for consistent processing
  const fetchDetailsForGroups = groupsArray.map((group) => { // fetch task lists and members for each group
    return new Promise((resolve, reject) => {
      const getTaskListsQuery = `SELECT * FROM TaskList WHERE Group_ID = ?`;
      const getMembersQuery = `
        SELECT u.User_ID, u.User_Username
        FROM GroupMember gm
        JOIN User u ON gm.User_ID = u.User_ID
        WHERE gm.Group_ID = ?
      `;

      db.all(getTaskListsQuery, [group.Group_ID], (taskListError, taskLists) => {
        if (taskListError) reject({ errMessage: "Database error", error: taskListError.message }); // check for error
        else {
          db.all(getMembersQuery, [group.Group_ID], (memberError, members) => {
            if (memberError) reject({ errMessage: "Database error", error: memberError.message });
            else {
              resolve({
                ...group,
                TaskLists: taskLists || [],
                Members: members || [],
              });
            }
          });
        }
      });
    });
  });

  // resolve all promises and return the result
  return Promise.all(fetchDetailsForGroups)
    .then((groupsWithDetails) => {
      if (isArray) {
        res.json({ groups: groupsWithDetails });
      } else {
        res.json({ group: groupsWithDetails[0] });
      }
    })
    .catch((error) => {
      res.status(500).json({ errMessage: "Error fetching task lists or members", error: error.message });
    }
  );
};

// GET MY GROUPS FUNCTION
const getMyGroups = (req, res) => {
  try {
    const userID = req.user.id;
    const getMyGroupsQuery = "SELECT * FROM Groups WHERE User_ID = ?"; // get all groups the user owns

    db.all(getMyGroupsQuery, [userID], (error, groups) => {
      if (error) return res.status(500).json({ errMessage: "Database error", error: error.message }); // check for error

      fetchGroupDetails(groups, res);
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// GET GROUP MEMBERS FUNCTION
const getGroupMembers = (req, res) => {
  try {
    const { groupID } = req.query;
    const getGroupMembersQuery = "SELECT gm.User_ID, gm.User_Username, gm.JoinDate FROM GroupMember gm WHERE gm.Group_ID = ?";

    db.all(getGroupMembersQuery, [groupID], (error, members) => {
      if (error) return res.status(500).json({ errMessage: "Database error", error: error.message }); // check for error
      res.json({ members });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// REMOVE GROUP MEMBER FUNCTION
const removeGroupMember = (req, res) => {
  try {
    const { groupID, userID } = req.body;
    const removeMemberQuery = "DELETE FROM GroupMember WHERE Group_ID = ? AND User_ID = ?";

    db.run(removeMemberQuery, [groupID, userID], (removeError) => {
      if (removeError) return res.status(500).json({ errMessage: "Failed to remove member" });          // check for error
      if (this.changes === 0) return res.status(404).json({ errMessage: "Member not found in group" }); // check if member was found

      res.json({ message: "Member removed successfully" });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

const assignTaskListToMember = (req, res) => {
  try {
    const { listID, userID, groupID } = req.body;
    const requesterID = req.user.id;
    const verifyAdminQuery = "SELECT User_ID FROM Groups WHERE Group_ID = ?"; // verify requester is group admin

    db.get(verifyAdminQuery, [groupID], (adminError, group) => {
      if (adminError) return res.status(500).json({ errMessage: "Database error", error: adminError.message }); // check for error

      if (!group || group.User_ID !== requesterID) {
        return res.status(403).json({ errMessage: "Only group admin can assign tasks" });
      }

      // check if user is already assigned
      const checkAssignmentQuery = "SELECT * FROM TaskListMembers WHERE List_ID = ? AND User_ID = ?";

      db.get(checkAssignmentQuery, [listID, userID], (checkError, existing) => {
        if (checkError) {
          return res.status(500).json({ errMessage: "Database error" });
        }

        if (existing) {
          return res.json({ message: "User already has access to this task list" });
        }

        // assign the task list
        const assignmentID = helpers.generateEightDigitID();
        const assignQuery = "INSERT INTO TaskListMembers (TaskListMembers_ID, User_ID, List_ID) VALUES (?, ?, ?)";

        db.run(assignQuery, [assignmentID, userID, listID], (assignError) => {
          if (assignError) return res.status(500).json({ errMessage: "Failed to assign task list" }); // check for error
          res.json({ message: "Task list assigned successfully" });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// GET USER JOINED GROUPS FUNCTION
const getUserJoinedGroups = async (req, res) => {
  try {
    const userId = req.params.userId;

    // retrieve groups the user is a member of
    const getUserJoinedGroupsQuery = `
      SELECT g.Group_ID, g.GroupName, g.CreatedDate, g.IsActive, gm.JoinDate, g.User_ID as Creator_ID, u.User_Username as Creator_Username
      FROM Groups g
      JOIN GroupMember gm ON g.Group_ID = gm.Group_ID
      JOIN User u ON g.User_ID = u.User_ID
      WHERE gm.User_ID = ?
    `;

    db.all(getUserJoinedGroupsQuery, [userId], (error, groups) => {
      if (error) return res.status(500).json({ errMessage: "Database error", error: error.message }); // check for error

      fetchGroupDetails(groups, res);
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// DELETE GROUP FUNCTION
const deleteGroup = async (req, res) => {
  try {
    const { groupID } = req.body;
    const userID = req.user.id;

    // check if user is the group creator (owner)
    const checkOwnerQuery = "SELECT User_ID FROM Groups WHERE Group_ID = ?";
    db.get(checkOwnerQuery, [groupID], (error, row) => {
      if (error) return res.status(500).json({ errMessage: "Error checking group owner", error: error.message }); // check for error

      if (!row) { // group not found? error
        return res.status(404).json({ errMessage: "Group not found" });
      }

      if (row.User_ID !== userID) { // user is not the owner? error
        return res.status(403).json({ errMessage: "Not authorized to delete this group" });
      }

      // delete all task lists in the group
      const deleteListsQuery = "DELETE FROM TaskList WHERE Group_ID = ?";
      db.run(deleteListsQuery, [groupID], (error) => {
        if (error) return res.status(500).json({ errMessage: "Error deleting task lists", error: error.message });


        // delete all group members
        const deleteMembersQuery = "DELETE FROM GroupMember WHERE Group_ID = ?";
        db.run(deleteMembersQuery, [groupID], (error) => {
          if (error) return res.status(500).json({ errMessage: "Error deleting group members", error: error.message })

          // delete the group itself
          const deleteGroupQuery = "DELETE FROM Groups WHERE Group_ID = ?";
          db.run(deleteGroupQuery, [groupID], (error) => {
            if (error) return res.status(500).json({ errMessage: "Error deleting group", error: error.message });

            res.json({ message: "Group and all related data deleted successfully" });
          });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// CHANGE GROUP STATE FUNCTION
const changeGroupstate = async (req, res) => {
  try {
    const { groupID, newState } = req.body;

    if (groupID == null || newState == null) {
      return res.status(400).json({ errMessage: "Missing group ID or state" });
    }

    const changeGroupStateQuery = `UPDATE Groups SET IsActive = ? WHERE Group_ID = ?`;
    await db.run(changeGroupStateQuery, [newState ? 1 : 0, groupID]);
    res.status(200).json({ message: "Group state updated" });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
}

// GET GROUP FUNCTION
const getGroup = (req, res) => {
  try {
    const groupID = req.params.groupID;
    const getGroupQuery = "SELECT * FROM Groups WHERE Group_ID = ?";

    db.get(getGroupQuery, [groupID], (error, group) => {
      if (error) return res.status(500).json({ errMessage: "Database error", error: error.message }); // check for error

      if (!group) {
        return res.status(404).json({ errMessage: "Group not found" });
      }

      fetchGroupDetails(group, res, false);
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// LEAVE GROUP FUNCTION
const leaveGroup = (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user.id;
    const leaveGroupQuery = "DELETE FROM GroupMember WHERE Group_ID = ? AND User_ID = ?";

    db.run(leaveGroupQuery, [groupId, userId], (error) => {
      if (error) return res.status(500).json({ errMessage: "Failed to leave group" }); // check for error

      if (this.changes === 0) {
        return res.status(404).json({ errMessage: "User not in group or group not found" });
      }

      res.json({ success: true, message: "Left group successfully" });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
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
  changeGroupstate,
  getGroup,
  leaveGroup,
};