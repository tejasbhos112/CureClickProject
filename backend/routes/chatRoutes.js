const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  startChat,
  getMessages
} = require("../controllers/chatController");

// Start or get existing chat
router.post("/start", auth, startChat);

// Get chat messages
router.get("/messages/:appointmentId", auth, getMessages);



module.exports = router;
