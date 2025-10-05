const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? true
    : 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/taskRoutes"));
app.use("/", require("./routes/groupRoutes"));
app.use("/", require("./routes/shareRoutes"));

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});