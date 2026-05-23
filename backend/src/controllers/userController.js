const User = require("../models/User");
const Conversation = require("../models/Conversation");

/**
 * @route  GET /api/users
 * @desc   Search users by username (excludes self)
 * @access Private
 */
const getUsers = async (req, res, next) => {
  try {
    const { search = "" } = req.query;
    const currentUserId = req.user._id;

    // Build search query - exclude current user
    const query = {
      _id: { $ne: currentUserId },
    };

    if (search.trim()) {
      query.username = { $regex: search.trim(), $options: "i" };
    }

    const users = await User.find(query)
      .select("username avatar bio isOnline lastSeen")
      .limit(20)
      .sort({ isOnline: -1, username: 1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  GET /api/users/:id
 * @desc   Get a single user profile
 * @access Private
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username avatar bio isOnline lastSeen createdAt"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  GET /api/users/conversations
 * @desc   Get all conversations for current user (sidebar list)
 * @access Private
 */
const getMyConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "username avatar isOnline lastSeen")
      .populate("lastMessage", "content createdAt sender")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, getMyConversations };
