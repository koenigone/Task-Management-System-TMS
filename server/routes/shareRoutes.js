const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  inviteByEmail,
  getInvites,
  acceptInvite,
  denyInvites,
} = require("../controllers/shareController");
const authMiddleware = require("../middleware/authMiddleware");

// middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.post("/inviteByEmail", authMiddleware, inviteByEmail);
router.get("/getInvites", authMiddleware, getInvites);
router.post("/acceptInvite", authMiddleware, acceptInvite);
router.post("/denyInvite", denyInvites);

module.exports = router;
