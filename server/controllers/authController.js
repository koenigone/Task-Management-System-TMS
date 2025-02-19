const db = require("../config/db.js");

const signUp = (req, res) => {
  const { username, email, password } = req.body;

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

  // generate 8 digits ID for users
  const generateUserID = () => {
    return Math.floor(Math.random() * 90000000) + 10000000;
  }

  const sql = "INSERT INTO User (User_ID, User_Username, User_Email, User_Password) VALUES (?, ?, ?, ?)";
  
  db.run(sql, [generateUserID(), username, email, password], function (err) {
    if (err) {
      console.error("Error inserting user:", err.message);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json({ message: "User created successfully", userId: this.lastID });
  });
};

module.exports = { signUp, Login };
