const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/authRoutes"); // Import auth routes
app.use("/auth", authRoutes); // Base route for authentication

// Start Server
app.listen(3000, () => {
  try {
    console.log("Server running on port 3000");
  } catch (err) {
    console.error("Error starting the server:", err.message);
  }
});