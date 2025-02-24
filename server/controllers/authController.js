const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/jwt");

const test = (req, res) => {
  res.json("test is working");
};

// generate 8 digits ID for users
const generateUserID = () => {
  return Math.floor(Math.random() * 90000000) + 10000000;
};

const signUpUser = async (req, res) => {
  try {
    const userID = generateUserID();
    const { username, email, password } = req.body;

    // Validate if all fields are filled
    if (!username || !email || !password) {
      return res.json({ errMessage: "All fields are required" });
    }

    // Validate username length
    if (username.length < 5 || username.length > 20) {
      return res.json({
        errMessage: "Username must be between 5 and 20 characters",
      });
    }

    // Validate email is unique
    db.get(
      "SELECT * FROM User WHERE User_Email = ?",
      [email],
      async (err, row) => {
        if (err) {
          return res.json({ errMessage: "Database error", error: err });
        }
        if (row) {
          return res.json({ errMessage: "Email is taken, try another one" });
        }

        // Validate password length
        if (password.length < 8) {
          return res.json({
            errMessage: "Password should be at least 8 characters long.",
          });
        }

        // Hashing password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Sign-up query
        const signupQuery =
          "INSERT INTO User (User_ID, User_Username, User_Email, User_Password) VALUES (?, ?, ?, ?)";

        db.run(
          signupQuery,
          [userID, username, email, hashedPassword],
          function (error) {
            if (error) {
              return res.json({
                errMessage: "Database error",
                error: error.message,
              });
            }
            res.json({
              message: "Account created successfully",
              userId: this.lastID,
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ errMessage: "Internal server error" });
  }
};

// login section
const loginUser = (req, res) => {
  try {
    const { password, email } = req.body;

    // validate if all fields are filled
    if (!email || !password) return res.json({ errMessage: "All fields are required" });

    db.get("SELECT * FROM User WHERE User_Email = ?", [email],
      async (err, user) => {
        if (!user) return res.json({ errMessage: "Account doesn't exist" });
        if (err) return res.json({ errMessage: "Database error", error: err.message });

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.User_Password);
        if (!isMatch) {
          return res.json({
            errMessage: "Invalid email or password",
          });
        } else {
          jwt.sign( // if the password matches the one in the database, then initialize jsonwebtoken cookies
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
                return res
                  .status(500)
                  .json({ errMessage: "Token error", error: err.message });
              }
              res
                .cookie("token", token, {
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
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const getProfile = (req, res) => {
  const { token } = req.cookies;
  
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err); 
        return res.status(401).json({ errMessage: "Unauthorized" });
      }

      db.get("SELECT * FROM User WHERE User_ID = ?", [decoded.id], (err, user) => {
        if (err || !user) {
          console.error("Database error:", err);
          return res.status(500).json({ errMessage: "Database error" });
        }

        res.json({
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
    res.json(null);
  }
};

module.exports = { test, signUpUser, loginUser, getProfile };