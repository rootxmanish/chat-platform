const express = require("express");
const { getUsers, getUserById, getMyConversations } = require("../controllers/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get("/", getUsers);                        // GET /api/users?search=query
router.get("/conversations", getMyConversations); // GET /api/users/conversations
router.get("/:id", getUserById);                  // GET /api/users/:id

module.exports = router;
