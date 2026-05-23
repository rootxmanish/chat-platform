import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import { messageService, userService } from "../services/authService";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { socket } = useSocket();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]); // messages for active conversation
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [typingUsers, setTypingUsers] = useState({}); // { conversationId: userId }
  const typingTimeoutRef = useRef({});

  // Load sidebar conversations
  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const data = await userService.getConversations();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadConversations();
  }, [user, loadConversations]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId) => {
    setLoadingMessages(true);
    setMessages([]);
    try {
      const data = await messageService.getMessages(conversationId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Open a conversation (by user click or new message)
  const openConversation = useCallback(
    async (targetUser) => {
      try {
        const data = await messageService.getOrCreateConversation(targetUser._id);
        const conversation = data.conversation;
        setActiveConversation({ ...conversation, otherUser: targetUser });
        await loadMessages(conversation._id);

        // Add to conversations list if not already there
        setConversations((prev) => {
          const exists = prev.find((c) => c._id === conversation._id);
          if (!exists) return [{ ...conversation, otherUser: targetUser }, ...prev];
          return prev;
        });
      } catch (err) {
        console.error("Failed to open conversation:", err);
      }
    },
    [loadMessages]
  );

  // Send a message
  const sendMessage = useCallback(
    async (content) => {
      if (!activeConversation || !content.trim()) return;
      const otherUser = activeConversation.otherUser ||
        activeConversation.participants?.find((p) => p._id !== user?._id);

      try {
        const data = await messageService.sendMessage(otherUser._id, content);
        const newMessage = data.message;

        // Optimistically add message to UI
        setMessages((prev) => [...prev, newMessage]);

        // Update conversation last message in sidebar
        setConversations((prev) =>
          prev.map((c) =>
            c._id === data.conversationId
              ? { ...c, lastMessage: newMessage, updatedAt: new Date() }
              : c
          )
        );

        // Emit via socket for real-time delivery
        if (socket) {
          socket.emit("send-message", {
            receiverId: otherUser._id,
            message: newMessage,
            conversationId: data.conversationId,
          });
        }
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    },
    [activeConversation, user, socket]
  );

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Receive incoming message
    socket.on("receive-message", ({ message, conversationId }) => {
      // If active conversation matches, append message
      if (activeConversation?._id === conversationId) {
        setMessages((prev) => {
          // Avoid duplicates (message might already be added optimistically)
          const exists = prev.find((m) => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
      }

      // Update conversation preview in sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId
            ? { ...c, lastMessage: message, updatedAt: new Date() }
            : c
        )
      );
    });

    // Typing indicators
    socket.on("typing", ({ senderId, conversationId }) => {
      setTypingUsers((prev) => ({ ...prev, [conversationId]: senderId }));
    });

    socket.on("stop-typing", ({ conversationId }) => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[conversationId];
        return updated;
      });
    });

    return () => {
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [socket, activeConversation]);

  // Emit typing event with debounce
  const emitTyping = useCallback(
    (conversationId, receiverId) => {
      if (!socket || !conversationId || !receiverId) return;

      socket.emit("typing", { receiverId, conversationId });

      // Clear previous timeout
      if (typingTimeoutRef.current[conversationId]) {
        clearTimeout(typingTimeoutRef.current[conversationId]);
      }

      // Auto stop typing after 3 seconds of inactivity
      typingTimeoutRef.current[conversationId] = setTimeout(() => {
        socket.emit("stop-typing", { receiverId, conversationId });
      }, 3000);
    },
    [socket]
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        loadingMessages,
        loadingConversations,
        typingUsers,
        loadConversations,
        openConversation,
        sendMessage,
        emitTyping,
        setActiveConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
