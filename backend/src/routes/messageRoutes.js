const express = require("express");
const { body } = require("express-validator");
const { sendMessage, getMessages, getOrCreateConversation } = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All message routes require authentication
router.use(protect);

const sendValidation = [
  body("receiverId").notEmpty().withMessage("Receiver ID is required"),
  body("content").trim().notEmpty().withMessage("Message content is required")
    .isLength({ max: 2000 }).withMessage("Message too long"),
];

router.post("/send", sendValidation, sendMessage);           // POST /api/messages/send
router.post("/conversation", getOrCreateConversation);       // POST /api/messages/conversation
router.get("/:conversationId", getMessages);                 // GET /api/messages/:conversationId

module.exports = router;
