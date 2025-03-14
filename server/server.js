const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// routes
app.use("/", require('./routes/authRoutes'));
app.use("/", require("./routes/taskRoutes"));
app.use("/", require("./routes/groupRoutes"));
app.use("/", require("./routes/shareRoutes"));

// server port
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}}`);
});