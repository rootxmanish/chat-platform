const { verifyToken } = require("../services/tokenService");
const User = require("../models/User");

/**
 * Socket.IO handler
 * Manages real-time events: messaging, typing, online status
 */
const initializeSocket = (io) => {
  // Map of userId -> socketId for tracking online users
  const onlineUsers = new Map();

  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select("username avatar isOnline");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.userId;
    console.log(`🔌 User connected: ${socket.user.username} (${socket.id})`);

    // Track online user
    onlineUsers.set(userId, socket.id);

    // Update user's online status in DB
    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      socketId: socket.id,
    });

    // Join personal room (for direct messages)
    socket.join(userId);

    // Broadcast updated online users list to all clients
    const onlineUserIds = Array.from(onlineUsers.keys());
    io.emit("online-users", onlineUserIds);

    // ─── Send Message ────────────────────────────────────────────────
    socket.on("send-message", async (data) => {
      try {
        const { receiverId, message, conversationId } = data;

        // Emit to receiver's personal room
        io.to(receiverId).emit("receive-message", {
          message,
          conversationId,
        });

        // Also emit back to sender's other devices/tabs
        socket.to(userId).emit("receive-message", {
          message,
          conversationId,
        });
      } catch (error) {
        socket.emit("error", { message: "Failed to deliver message" });
      }
    });

    // ─── Typing Indicators ───────────────────────────────────────────
    socket.on("typing", ({ receiverId, conversationId }) => {
      io.to(receiverId).emit("typing", {
        senderId: userId,
        conversationId,
      });
    });

    socket.on("stop-typing", ({ receiverId, conversationId }) => {
      io.to(receiverId).emit("stop-typing", {
        senderId: userId,
        conversationId,
      });
    });

    // ─── Disconnect ──────────────────────────────────────────────────
    socket.on("disconnect", async () => {
      console.log(`🔌 User disconnected: ${socket.user.username}`);

      onlineUsers.delete(userId);

      // Update user's offline status in DB
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
        socketId: null,
      });

      // Broadcast updated online users list
      const updatedOnlineUsers = Array.from(onlineUsers.keys());
      io.emit("online-users", updatedOnlineUsers);
    });
  });
};

module.exports = initializeSocket;
