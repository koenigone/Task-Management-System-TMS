const db = require("../config/db");
const helpers = require("../helpers/generateID");

const inviteByEmail = (req, res) => {
  try {
    const inviteID = helpers.generateEightDigitID();;
    const senderID = req.user.id;
    const { listID, groupID, userEmail } = req.body;

    if (!userEmail) {
      return res.json({ errMessage: "Email is required" });
    }

    if (!listID && !groupID) {
      return res.json({ errMessage: "Either listID or groupID is required" });
    }

    const getSenderUsernameQuery = "SELECT User_Username FROM User WHERE User_ID = ?";
    db.get(getSenderUsernameQuery, [senderID], (error, sender) => {
      if (error) {
        console.error("Database error:", error.message);
        return res.json({ errMessage: "Database error" });
      }

      if (!sender) {
        return res.json({ errMessage: "Sender not found" });
      }

      const senderUsername = sender.User_Username;

      const getSenderEmailQuery = "SELECT User_Email FROM User WHERE User_ID = ?";
      db.get(getSenderEmailQuery, [senderID], (error, senderEmailResult) => {
        if (error) {
          console.error("Database error:", error.message);
          return res.json({ errMessage: "Database error" });
        }

        if (senderEmailResult.User_Email === userEmail) {
          return res.json({ errMessage: "You cannot invite yourself" });
        }

        const findUserQuery = "SELECT User_ID FROM User WHERE User_Email = ?";
        db.get(findUserQuery, [userEmail], (error, user) => {
          if (error) {
            console.error("Database error:", error.message);
            return res.json({ errMessage: "Database error" });
          }

          if (!user) {
            return res.json({ errMessage: "User not found" });
          }

          const receiverID = user.User_ID;

          if (listID) {
            const getListNameQuery = "SELECT ListName FROM TaskList WHERE List_ID = ?";
            db.get(getListNameQuery, [listID], (error, list) => {
              if (error) {
                console.error("Database error:", error.message);
                return res.json({ errMessage: "Database error" });
              }

              if (!list) {
                return res.json({ errMessage: "List not found" });
              }

              const sendInviteQuery = `
                INSERT INTO Invite (Invite_ID, Sender_User_ID, Sender_User_Username, 
                  Receiver_User_ID, TaskList_ID, TaskList_Name, Status)
                VALUES (?, ?, ?, ?, ?, ?, 0)
              `;

              db.run(
                sendInviteQuery,
                [inviteID, senderID, senderUsername, receiverID, listID, list.ListName],
                function (error) {
                  if (error) {
                    console.error("Database error:", error.message);
                    return res.json({ errMessage: "Failed to send invite" });
                  }
                  res.json({ message: "Task list invite sent successfully" });
                }
              );
            });
          } else {
            const getGroupNameQuery = "SELECT GroupName FROM Groups WHERE Group_ID = ?";
            db.get(getGroupNameQuery, [groupID], (error, group) => {
              if (error) {
                console.error("Database error:", error.message);
                return res.json({ errMessage: "Database error" });
              }

              if (!group) {
                return res.json({ errMessage: "Group not found" });
              }

              const sendInviteQuery = `
                INSERT INTO Invite (Invite_ID, Sender_User_ID, Sender_User_Username, 
                  Receiver_User_ID, Group_ID, Group_Name, Status)
                VALUES (?, ?, ?, ?, ?, ?, 0)
              `;

              db.run(
                sendInviteQuery,
                [inviteID, senderID, senderUsername, receiverID, groupID, group.GroupName],
                function (error) {
                  if (error) {
                    console.error("Database error:", error.message);
                    return res.json({ errMessage: "Failed to send invite" });
                  }
                  res.json({ message: "Group invite sent successfully" });
                }
              );
            });
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.json({ errMessage: "Internal server error" });
  }
};

const getInvites = (req, res) => {
  try {
    const userID = req.user.id;

    const getInvitesQuery =
      "SELECT * FROM Invite WHERE Receiver_User_ID = ? AND Status = 0";

    db.all(getInvitesQuery, [userID], (error, invites) => {
      if (error) {
        console.error("Database error:", error.message);
        return res.status(500).json({
          errMessage: "Failed to fetch invites",
          error: error.message,
        });
      }

      res.json({ invites });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      errMessage: "Internal server error",
      error: error.message,
    });
  }
};

const acceptInvite = (req, res) => {
  try {
    const { inviteId } = req.body;
    const userID = req.user.id;
    const getInviteQuery = "SELECT * FROM Invite WHERE Invite_ID = ?";
    
    db.get(getInviteQuery, [inviteId], (inviteError, invite) => {
      if (inviteError) {
        console.error("Database error:", inviteError.message);
        return res.status(500).json({ 
          errMessage: "Failed to fetch invite", 
          error: inviteError.message 
        });
      }

      if (!invite) {
        return res.status(404).json({ errMessage: "Invite not found" });
      }

      const getUserQuery = "SELECT User_Username FROM User WHERE User_ID = ?";      
      db.get(getUserQuery, [userID], (userError, user) => {
        if (userError) {
          console.error("Database error:", userError.message);
          return res.status(500).json({ 
            errMessage: "Failed to fetch user data", 
            error: userError.message 
          });
        }

        if (!user) {
          return res.status(404).json({ errMessage: "User not found" });
        }

        const updateInviteQuery = "UPDATE Invite SET Status = 1 WHERE Invite_ID = ?";

        db.run(updateInviteQuery, [inviteId], function (updateError) {
          if (updateError) {
            console.error("Database error:", updateError.message);
            return res.status(500).json({ 
              errMessage: "Failed to update invite", 
              error: updateError.message 
            });
          }

          if (invite.TaskList_ID) {
            const taskListMemberID = helpers.generateEightDigitID();
            const addToListMembersQuery = `
              INSERT INTO TaskListMembers 
                (TaskListMembers_ID, User_ID, List_ID) 
              VALUES (?, ?, ?)
            `;

            db.run(
              addToListMembersQuery, 
              [taskListMemberID, userID, invite.TaskList_ID],
              function (listError) {
                if (listError) {
                  console.error("Database error:", listError.message);
                  return res.status(500).json({ 
                    errMessage: "Failed to add user to task list", 
                    error: listError.message 
                  });
                }
                res.json({ success: true, message: "Task list invite accepted" });
              }
            );
          } 
          else if (invite.Group_ID) {
            const groupMemberID = helpers.generateEightDigitID();
            const joinDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            const addToGroupMembersQuery = `
              INSERT INTO GroupMember 
                (GroupMember_ID, User_ID, User_Username, Group_ID, JoinDate) 
              VALUES (?, ?, ?, ?, ?)
            `;

            db.run(
              addToGroupMembersQuery, 
              [groupMemberID, userID, user.User_Username, invite.Group_ID, joinDate],
              function (groupError) {
                if (groupError) {
                  console.error("Database error:", groupError.message);
                  return res.status(500).json({ 
                    errMessage: "Failed to add user to group", 
                    error: groupError.message 
                  });
                }
                res.json({ success: true, message: "Group invite accepted" });
              }
            );
          } 
          else {
            res.status(400).json({ errMessage: "Invalid invite type" });
          }
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ 
      errMessage: "Internal server error", 
      error: error.message 
    });
  }
};

const denyInvites = (req, res) => {
  try {
    const { inviteId } = req.body;

    const updateInviteQuery = "DELETE FROM Invite WHERE Invite_ID = ?";

    db.run(updateInviteQuery, [inviteId], function (error) {
      if (error) {
        console.error("Database error:", error.message);
        return res.status(500).json({
          errMessage: "Failed to update invite",
          error: error.message,
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          errMessage: "Invite not found",
        });
      }

      res.json({ success: true, message: "Invite rejected" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      errMessage: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { inviteByEmail, getInvites, acceptInvite, denyInvites };