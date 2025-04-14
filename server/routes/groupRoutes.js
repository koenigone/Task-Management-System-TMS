const express = require("express");
const router = express.Router();
const cors = require("cors");
const groupController = require("../controllers/groupController");
const authMiddleware = require("../middleware/authMiddleware");

// middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.post("/createGroup", authMiddleware, groupController.createGroup);
router.get("/getMyGroups", authMiddleware, groupController.getMyGroups);
router.get("/getGroup/:groupID", authMiddleware, groupController.getGroup);
router.post("/leaveGroup", authMiddleware, groupController.leaveGroup);
router.get("/getGroupMembers", authMiddleware, groupController.getGroupMembers);
router.post("/removeGroupMember", authMiddleware, groupController.removeGroupMember);
router.post("/assignTaskListToMember", authMiddleware, groupController.assignTaskListToMember);
router.get("/getUserJoinedGroups/:userId", authMiddleware, groupController.getUserJoinedGroups);
router.post("/deleteGroup", authMiddleware, groupController.deleteGroup);
router.post("/changeGroupState", authMiddleware, groupController.changeGroupstate);

module.exports = router;
