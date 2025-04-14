const db = require("../config/db");
const helpers = require("../helpers/generateID");

/* INVITE BY EMAIL FUNCTION
  This function is used to invite a user to a task list or group by email
  It generates an invite ID, sender ID, list ID, group ID, and user email
  It then checks if the user email is required and if the list ID or group ID is required
  It then checks if the sender is the list creator or group creator
  It then sends an invite to the user
*/
const inviteByEmail = (req, res) => {
  try {
    const inviteID = helpers.generateEightDigitID();
    const senderID = req.user.id;
    const { listID, groupID, userEmail } = req.body;

    if (!userEmail) {
      return res.json({ errMessage: "Email is required" });
    }

    if (!listID && !groupID) {
      return res.json({ errMessage: "Either listID or groupID is required" });
    }

    // If listID is provided, verify that the sender is the list creator
    if (listID) {
      const getListCreatorQuery = "SELECT User_ID FROM TaskList WHERE List_ID = ?";
      db.get(getListCreatorQuery, [listID], (error, list) => {
        if (error) return res.json({ errMessage: "Database error" });       // check for error
        if (!list) return res.json({ errMessage: "Task list not found" });  // check if list exists

        if (senderID !== list.User_ID) {
          return res.json({ errMessage: "You are not authorized to invite users to a task list you didn't create" });
        }

        sendInvite(); // proceed with invite logic if sender is the creator
      });
    } else {
      const getGroupCreatorQuery = "SELECT User_ID FROM Groups WHERE Group_ID = ?";
      db.get(getGroupCreatorQuery, [groupID], (error, group) => {
        if (error) return res.json({ errMessage: "Database error" });   // check for error
        if (!group) return res.json({ errMessage: "Group not found" }); // check if group exists

        if (senderID !== group.User_ID) { // check if sender is the group creator
          return res.json({ errMessage: "You are not authorized to invite users to this group" });
        }

        sendInvite();
      });
    }

    const sendInvite = () => {
      const getSenderUsernameQuery = "SELECT User_Username FROM User WHERE User_ID = ?";
      db.get(getSenderUsernameQuery, [senderID], (error, sender) => {
        if (error) return res.json({ errMessage: "Database error" });    
        if (!sender) return res.json({ errMessage: "Sender not found" }); // check if sender exists

        const senderUsername = sender.User_Username;
        const getSenderEmailQuery = "SELECT User_Email FROM User WHERE User_ID = ?";

        db.get(getSenderEmailQuery, [senderID], (error, senderEmailResult) => {
          if (error) return res.json({ errMessage: "Database error" });                     
          if (!senderEmailResult) return res.json({ errMessage: "Sender email not found" }); // check if sender email exists

          if (senderEmailResult.User_Email === userEmail) { // check if sender email is the same as the user email
            return res.json({ errMessage: "You cannot invite yourself" });
          }

          const findUserQuery = "SELECT User_ID FROM User WHERE User_Email = ?";
          db.get(findUserQuery, [userEmail], (error, user) => {
            if (error) return res.json({ errMessage: "Database error" });
            if (!user) return res.json({ errMessage: "User not found" }); // check if user exists

            const receiverID = user.User_ID;

            if (listID) {
              const getListNameQuery = "SELECT ListName FROM TaskList WHERE List_ID = ?";
              db.get(getListNameQuery, [listID], (error, list) => {
                if (error) return res.json({ errMessage: "Database error" });
                if (!list) return res.json({ errMessage: "List not found" }); // check if list exists

                const sendInviteQuery = `
                  INSERT INTO Invite (Invite_ID, Sender_User_ID, Sender_User_Username, 
                    Receiver_User_ID, TaskList_ID, TaskList_Name, Status)
                  VALUES (?, ?, ?, ?, ?, ?, 0)
                `;

                db.run(sendInviteQuery, [inviteID, senderID, senderUsername, receiverID, listID, list.ListName], (error) => {
                  if (error) return res.json({ errMessage: "Failed to send invite" });
                  res.json({ message: "Task list invite sent successfully" });
                });
              });
            } else {
              const getGroupNameQuery = "SELECT GroupName FROM Groups WHERE Group_ID = ?";
              db.get(getGroupNameQuery, [groupID], (error, group) => {
                if (error) return res.json({ errMessage: "Database error" });  
                if (!group) return res.json({ errMessage: "Group not found" }); // check if group exists

                const sendInviteQuery = `
                  INSERT INTO Invite (Invite_ID, Sender_User_ID, Sender_User_Username, 
                    Receiver_User_ID, Group_ID, Group_Name, Status)
                  VALUES (?, ?, ?, ?, ?, ?, 0)
                `;

                db.run(sendInviteQuery, [inviteID, senderID, senderUsername, receiverID, groupID, group.GroupName], (error) => {
                  if (error) return res.json({ errMessage: "Failed to send invite" });
                  res.json({ message: "Group invite sent successfully" });
                });
              });
            }
          });
        });
      });
    };
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// GET INVITES FUNCTION
const getInvites = (req, res) => {
  try {
    const userID = req.user.id;
    const getInvitesQuery = "SELECT * FROM Invite WHERE Receiver_User_ID = ? AND Status = 0";

    db.all(getInvitesQuery, [userID], (error, invites) => {
      if (error) return res.status(500).json({ errMessage: "Failed to fetch invites", error: error.message });
      res.json({ invites });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// ACCEPT INVITE FUNCTION
/*
  This function is used to accept an invite
  It updates the invite status to 1
  It then adds the user to the task list or group
  It then sends a success message
*/
const acceptInvite = (req, res) => {
  try {
    const { inviteId } = req.body;
    const userID = req.user.id;
    const getInviteQuery = "SELECT * FROM Invite WHERE Invite_ID = ?";

    db.get(getInviteQuery, [inviteId], (inviteError, invite) => {
      if (inviteError) return res.status(500).json({ errMessage: "Failed to fetch invite", error: inviteError.message }); // check for error
      if (!invite) return res.status(404).json({ errMessage: "Invite not found" });                                       // check if invite exists

      const getUserQuery = "SELECT User_Username FROM User WHERE User_ID = ?";
      db.get(getUserQuery, [userID], (userError, user) => {
        if (userError) return res.status(500).json({ errMessage: "Failed to fetch user data", error: userError.message });
        if (!user) return res.status(404).json({ errMessage: "User not found" });                                         // check if user exists

        const updateInviteQuery = "UPDATE Invite SET Status = 1 WHERE Invite_ID = ?";

        db.run(updateInviteQuery, [inviteId], (updateError) => {
          if (updateError) return res.status(500).json({ errMessage: "Failed to update invite", error: updateError.message });

          if (invite.TaskList_ID) {
            const taskListMemberID = helpers.generateEightDigitID();
            const addToListMembersQuery = "INSERT INTO TaskListMembers (TaskListMembers_ID, User_ID, List_ID) VALUES (?, ?, ?)";

            db.run(addToListMembersQuery, [taskListMemberID, userID, invite.TaskList_ID], (listError) => {
              if (listError) return res.status(500).json({ errMessage: "Failed to add user to task list", error: listError.message });
              res.json({ success: true, message: "Task list invite accepted" });
            });

          } else if (invite.Group_ID) {
            const groupMemberID = helpers.generateEightDigitID();
            const joinDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

            const addToGroupMembersQuery = "INSERT INTO GroupMember (GroupMember_ID, User_ID, User_Username, Group_ID, JoinDate) VALUES (?, ?, ?, ?, ?)";

            db.run(addToGroupMembersQuery, [groupMemberID, userID, user.User_Username, invite.Group_ID, joinDate], (groupError) => {
              if (groupError) return res.status(500).json({ errMessage: "Failed to add user to group", error: groupError.message });
              res.json({ success: true, message: "Group invite accepted" });
            });
          } else {
            res.status(400).json({ errMessage: "Invalid invite type" });
          }
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// DENY INVITE FUNCTION
const denyInvites = (req, res) => {
  try {
    const { inviteId } = req.body;
    const denyInviteQuery = "DELETE FROM Invite WHERE Invite_ID = ?";

    db.run(denyInviteQuery, [inviteId], (error) => {
      if (error) return res.status(500).json({ errMessage: "Failed to update invite", error: error.message }); // check for error
      if (this.changes === 0) return res.status(404).json({ errMessage: "Invite not found" });                 // check if invite exists

      res.json({ success: true, message: "Invite rejected" });
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

module.exports = { inviteByEmail, getInvites, acceptInvite, denyInvites };