const db = require("../config/db.js");

// generate 8 digits ID for users
const generateUserID = () => {
  return Math.floor(Math.random() * 90000000) + 10000000;
}

const signUp = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  } else if (username < 5 || username > 20) {
    return res.status(401).json({ message: "Username must be between 5 and 20 characters." });
  } else {
    const sql = "INSERT INTO User (User_ID, User_Username, User_Email, User_Password) VALUES (?, ?, ?, ?)";

    db.run(sql, [generateUserID(), username, email, password], function (err) {
      if (err) {
        console.error("Error inserting user:", err.message);
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      res.json({ message: "User created successfully", userId: this.lastID });
    });
  }
};

module.exports = { signUp };