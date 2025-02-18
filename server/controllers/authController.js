const db = require("../config/db");
const bcrypt = require("bcrypt");

// generates 8 digits ID for each user
const generateUserID = () => {
  return Math.floor(Math.random() * 90000000) + 10000000;
};

// sign up section
const signUp = async (req, res) => {

  const userID = generateUserID();    // generate user ID
  const username = req.body.username; // get username
  const email = req.body.email;       // get email
  const password = req.body.password; // get password

  // validate fields are not empty
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required" });
  }

  // validate username length
  if (username.length < 5 || username.length > 20) {
    return res
      .status(400)
      .json({ message: "Username must be between 5 and 20 characters." });
  }

  // validate email is unique
  db.get(
    "SELECT * FROM User WHERE User_Email = ?",
    [email],
    async (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (row) {
        return res
          .status(400)
          .json({ message: "Email already registered" });
      }

      // Hashing password using bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // sign up query
      const signupQuery =
        "INSERT INTO User (User_ID, User_Username, User_Email, User_Password) VALUES (?, ?, ?, ?)";

      db.run(signupQuery, [userID, username, email, hashedPassword], function (error) {
        if (error) {
          return res
            .status(500)
            .json({ message: "Database error", error: err.message });
        }
        res.json({ message: "Account created successfully", userId: this.lastID });
      });
    }
  );
};

// login section
const Login = async (req, res) => {

  const email = req.body.email;        // login email
  const password = req.body.password;  // login password

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const loginQuery = "SELECT * FROM User WHERE User_Email = ?";

  db.get(loginQuery, [email], async (error, user) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Database error", error: err.message });
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.User_Password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.user = { 
      id: user.User_ID, 
      username: user.User_Username, 
      email: user.User_Email 
    };

    res.json({
      message: "Login successful", 
      user: req.session.user
    });
  });
};

module.exports = { signUp, Login };
