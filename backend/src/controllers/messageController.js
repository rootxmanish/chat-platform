const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { validationResult } = require("express-validator");

/**
 * @route  POST /api/messages/send
 * @desc   Send a message to another user
 *         Creates conversation if it doesn't exist
 * @access Private
 */
const sendMessage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ success: false, message: "Cannot send message to yourself." });
    }

    // Find existing conversation or create a new one
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create the message
    const message = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      content: content.trim(),
      readBy: [senderId], // Sender has already "read" their own message
    });

    // Populate sender info for the response
    await message.populate("sender", "username avatar");

    // Update conversation with the latest message
    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json({
      success: true,
      message,
      conversationId: conversation._id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  GET /api/messages/:conversationId
 * @desc   Get paginated messages for a conversation
 * @access Private
 */
const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 40 } = req.query;

    // Verify user is a participant in this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message: "Conversation not found or access denied.",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find({
      conversationId,
      isDeleted: false,
    })
      .populate("sender", "username avatar")
      .sort({ createdAt: -1 }) // newest first for pagination
      .skip(skip)
      .limit(parseInt(limit));

    // Return in chronological order for display
    const chronologicalMessages = messages.reverse();

    const total = await Message.countDocuments({ conversationId, isDeleted: false });

    res.status(200).json({
      success: true,
      messages: chronologicalMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + messages.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  POST /api/messages/conversation
 * @desc   Get or create a conversation with a specific user
 * @access Private
 */
const getOrCreateConversation = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, userId] },
    }).populate("participants", "username avatar isOnline lastSeen");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, userId],
      });
      await conversation.populate("participants", "username avatar isOnline lastSeen");
    }

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getMessages, getOrCreateConversation };
