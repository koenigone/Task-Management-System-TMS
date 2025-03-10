const db = require("../config/db");

const generateInviteID = () => {
  return Math.floor(Math.random() * 90000000) + 10000000;
};

const inviteByEmail = (req, res) => {
  try {
    const inviteID = generateInviteID();
    const senderID = req.user.id;
    const { listID, userEmail } = req.body;

    // Input validation
    if (!userEmail || !listID) {
      return res.json({ errMessage: "All fields are required" });
    }

    const getSenderUsernameAndEmailQuery =
      "SELECT User_Username, User_Email FROM User WHERE User_ID = ?";

    db.get(getSenderUsernameAndEmailQuery, [senderID], (error, sender) => {
      if (error) {
        console.error("Database error:", error.message);
        return res.json({ errMessage: "Database error" });
      }

      if (!sender) {
        return res.json({ errMessage: "Sender not found" });
      }

      const senderUsername = sender.User_Username;
      const senderEmail = sender.User_Email;

      if (senderEmail === userEmail) {
        return res.json({ errMessage: "You cannot invite yourself" });
      }

      const getListNameQuery =
        "SELECT ListName FROM TaskList WHERE List_ID = ?";

      db.get(getListNameQuery, [listID], (error, list) => {
        if (error) {
          console.error("Database error:", error.message);
          return res.json({ errMessage: "Database error" });
        }

        if (!list) {
          return res.json({ errMessage: "List not found" });
        }

        const listName = list.ListName;

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

          const sendInviteQuery = `
            INSERT INTO Invite (Invite_ID, Sender_User_ID, Sender_User_Username, Receiver_User_ID, TaskList_ID, TaskList_Name, Status)
            VALUES (?, ?, ?, ?, ?, ?, 0)
          `;

          db.run(
            sendInviteQuery,
            [inviteID, senderID, senderUsername, receiverID, listID, listName],
            function (error) {
              if (error) {
                console.error("Database error:", error.message);
                return res.json({ errMessage: "Failed to send invite" });
              }

              res.json({
                message: "Invite sent successfully",
                inviteId: this.lastID,
              });
            }
          );
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

    const updateInviteQuery =
      "UPDATE Invite SET Status = 1 WHERE Invite_ID = ?";

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

      res.json({ success: true, message: "Invite accepted" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      errMessage: "Internal server error",
      error: error.message,
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