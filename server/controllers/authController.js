const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helpers = require("../helpers/generateID");
const { jwtSecret } = require("../config/jwt");

// SIGN UP FUNCTION
const signUpUser = async (req, res) => {
  try {
    const userID = helpers.generateEightDigitID();
    const { username, email, password, confirmPassword } = req.body;

    // validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({ errMessage: "All fields are required" });
    }

    if (username.length < 5 || username.length > 20) {
      return res.status(400).json({
        errMessage: "Username must be between 5 and 20 characters",
      });
    }

    // validate email is unique
    const emailQuery = "SELECT * FROM User WHERE User_Email = ?";
    db.get(emailQuery, [email], async (error, row) => {
      if (error) return res.status(500).json({ errMessage: "Database error", error: error });  // check if there's an error
      if (row) return res.status(400).json({ errMessage: "Email is taken, try another one" }); // check if email is taken

      if (password.length < 8) { // validate password lengthc
        return res.status(400).json({
          errMessage: "Password should be at least 8 characters long.",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          errMessage: "Passwords do not match"
        });
      }
        
        // hashing password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // sign up query
        const signupQuery = "INSERT INTO User (User_ID, User_Username, User_Email, User_Password) VALUES (?, ?, ?, ?)";

        db.run(signupQuery, [userID, username, email, hashedPassword], (error) => {
          if (error) return res.status(500).json({ errMessage: "Database error" });
          res.status(200).json({
            message: "Account created successfully",
            userId: this.lastID,
          });
        }
      );
    }
  );
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// LOGIN FUNCTION
const loginUser = (req, res) => {
  try {
    const { password, email } = req.body;

    if (!email || !password) { // validate if all fields are filled
      return res.status(400).json({ errMessage: "All fields are required" });
    }

    const loginQuery = "SELECT * FROM User WHERE User_Email = ?";
    db.get(loginQuery, [email], async (error, user) => {
      if (!user) return res.status(400).json({ errMessage: "Account doesn't exist" }); // check if account exists
      if (error) return res.status(500).json({ errMessage: "Database error", error: error.message }); // check for error

      // compare hashed password
      const isMatch = await bcrypt.compare(password, user.User_Password);
      
      if (!isMatch) {
        return res.status(400).json({ errMessage: "Invalid email or password" });
      } else {
        jwt.sign(
          {
            email: user.email,
            id: user.User_ID,
            name: user.username,
          },
          jwtSecret,
          {
            expiresIn: "7d",
          },
          (err, token) => {
            if (err) {
              return res.status(500).json({ errMessage: "Token error", error: err.message });
            }
            res.cookie("token", token, {
              httpOnly: true,
              secure: true,
              maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .json({
              message: "Login successful",
              token: token,
              id: user.User_ID,
              name: user.User_Username,
              email: user.User_Email,
            });
          }
        );
      }
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// GET PROFILE FUNCTION
const getProfile = (req, res) => {
  try {
    const { token } = req.cookies;

    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {

      if (err) return res.status(401).json({ errMessage: "Unauthorized" });

      const getProfileQuery = "SELECT * FROM User WHERE User_ID = ?";
      db.get(getProfileQuery, [decoded.id], (err, user) => {
        if (err || !user) {
          return res.status(500).json({ errMessage: "Database error" });
        }

        res.status(200).json({
          token: token,
          user: {
            id: user.User_ID,
            name: user.User_Username,
            email: user.User_Email,
          },
        });
        });
      });
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// CHANGE USERNAME FUNCTION
const changeUsername = (req, res) => {
  try {
    const userID = req.user.id;
    const { newUsername } = req.body;

    if (!newUsername) {
      res.status(400).json({ errMessage: "Username cannot be empty" });
    }

    if (newUsername.length < 5 || newUsername.length > 20) {
      return res.status(400).json({
        errMessage: "Username must be between 5 and 20 characters",
      });
    }

    const changeUsernameQuery = "UPDATE User SET User_Username = ? WHERE User_ID = ?;";

    db.run(changeUsernameQuery, [newUsername, userID], function (error) {
      if (error) return res.status(500).json({ errMessage: "Database error", error: error.message }); // check for error
      if (this.changes === 0) return res.status(404).json({ errMessage: "User not found" });          // check if user was found
      res.status(200).json({ message: "Username updated successfully" });                             // send success message
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// CHANGE PASSWORD FUNCTION
const changePassword = async (req, res) => {
  try {
    const userID = req.user.id;
    const { newPassword, confirmNewPassword } = req.body;

    if (!newPassword || !confirmNewPassword) {
      res.status(400).json({ errMessage: "Fields cannot be empty" });
    }

    if (newPassword.length < 8) {             // validate password length
      return res.status(400).json({
        errMessage: "Password should be at least 8 characters long.",
      });
    }

    if (newPassword != confirmNewPassword) {  // validate if passwords match
      res.status(400).json({
        errMessage: "Passwords do not match",
      });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    const changePasswordQuery = "UPDATE User SET User_Password = ? WHERE User_ID = ?";

    db.run(changePasswordQuery, [hashedNewPassword, userID], function (error) {
      if (error) return res.status(500).json({ errMessage: "Database error", error: error.message }); // check for error
      if (this.changes === 0) return res.status(404).json({ errMessage: "User not found" });          // check if user was found
      res.status(200).json({ message: "Password updated successfully" });                             // send success message
    });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

// SIGN OUT FUNCTION
const signOutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

const deleteAccount = (req, res) => {
  try {
    const userID = req.user.id;

    db.run('BEGIN TRANSACTION'); // start a transaction to ensure all deletions are atomic

    const deleteTaskListsQuery = "DELETE FROM TaskList WHERE User_ID = ?";
    db.run(deleteTaskListsQuery, [userID]);

    const deleteGroupsQuery = "DELETE FROM Groups WHERE User_ID = ?";
    db.run(deleteGroupsQuery, [userID]);

    const deleteGroupMembershipsQuery = "DELETE FROM GroupMember WHERE User_ID = ?";
    db.run(deleteGroupMembershipsQuery, [userID]);

    const deleteTaskListMembershipsQuery = "DELETE FROM TaskListMembers WHERE User_ID = ?";
    db.run(deleteTaskListMembershipsQuery, [userID]);

    const deleteAccountQuery = "DELETE FROM User WHERE User_ID = ?";
    db.run(deleteAccountQuery, [userID], function (error) {
      if (error) {
        db.run('ROLLBACK');
        return res.status(500).json({ errMessage: "Database error", error: error.message });
      }

      db.run('COMMIT', (error) => { // commit the transaction if all deletions were successful
        if (error) {
          return res.status(500).json({ errMessage: "Database error", error: error.message });
        }
        res.status(200).json({ message: "Account and all associated data deleted successfully" });
      });
    });
  } catch (error) {
    db.run('ROLLBACK'); // rollback the transaction if any deletion fails
    return res.status(500).json({ errMessage: "Internal server error" });
  }
};

module.exports = {
  signUpUser,
  loginUser,
  getProfile,
  changeUsername,
  changePassword,
  signOutUser,
  deleteAccount
};