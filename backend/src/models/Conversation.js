const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // Array of exactly 2 participants for 1-to-1 chat
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // Reference to the last message for preview
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    // Track unread counts per user
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only 2 participants per conversation
conversationSchema.pre("save", function (next) {
  if (this.participants.length !== 2) {
    return next(new Error("A conversation must have exactly 2 participants"));
  }
  next();
});

// Index for fast participant lookups
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
