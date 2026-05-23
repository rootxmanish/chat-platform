import api from "./api";

export const authService = {
  /**
   * Register a new user
   */
  register: async (username, password) => {
    const { data } = await api.post("/auth/register", { username, password });
    return data;
  },

  /**
   * Login with username and password
   */
  login: async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    return data;
  },

  /**
   * Get the current logged-in user
   */
  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};

export const userService = {
  /**
   * Search users by username
   */
  searchUsers: async (search = "") => {
    const { data } = await api.get(`/users?search=${encodeURIComponent(search)}`);
    return data;
  },

  /**
   * Get all conversations for sidebar
   */
  getConversations: async () => {
    const { data } = await api.get("/users/conversations");
    return data;
  },
};

export const messageService = {
  /**
   * Send a message to a user
   */
  sendMessage: async (receiverId, content) => {
    const { data } = await api.post("/messages/send", { receiverId, content });
    return data;
  },

  /**
   * Get messages for a conversation (paginated)
   */
  getMessages: async (conversationId, page = 1) => {
    const { data } = await api.get(`/messages/${conversationId}?page=${page}&limit=40`);
    return data;
  },

  /**
   * Get or create a conversation with a user
   */
  getOrCreateConversation: async (userId) => {
    const { data } = await api.post("/messages/conversation", { userId });
    return data;
  },
};
