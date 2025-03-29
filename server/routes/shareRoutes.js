const express = require("express");
const router = express.Router();
const cors = require("cors");
const shareController = require("../controllers/shareController");
const authMiddleware = require("../middleware/authMiddleware");

// middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.post("/inviteByEmail", authMiddleware, shareController.inviteByEmail);
router.get("/getInvites", authMiddleware, shareController.getInvites);
router.post("/acceptInvite", authMiddleware, shareController.acceptInvite);
router.post("/denyInvite", shareController.denyInvites);

module.exports = router;
