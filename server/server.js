const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Change this if React is hosted elsewhere
    credentials: true, // Allow sending cookies across origins
  })
);

// Session Middleware
app.use(
  session({
    secret: "sessionsecretkey", // Change this to a strong secret
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./database" }),
    cookie: {
      httpOnly: true, 
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
    },
  })
);

// Import and Use Routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Session Check Route
app.get("/auth/session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Logout Route
app.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});