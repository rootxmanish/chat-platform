import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

/**
 * Generate avatar initials from a username
 */
export const getInitials = (username = "") => {
  return username.slice(0, 2).toUpperCase();
};

/**
 * Generate a consistent color for a username (for avatar backgrounds)
 */
export const getAvatarColor = (username = "") => {
  const colors = [
    "from-violet-600 to-purple-700",
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-fuchsia-500 to-purple-600",
    "from-sky-500 to-indigo-600",
  ];
  const index = username.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Format message timestamp
 */
export const formatMessageTime = (date) => {
  const d = new Date(date);
  return format(d, "h:mm a");
};

/**
 * Format conversation last message time (sidebar)
 */
export const formatConversationTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d");
};

/**
 * Format last seen time
 */
export const formatLastSeen = (date) => {
  if (!date) return "a while ago";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Truncate long text with ellipsis
 */
export const truncate = (text = "", maxLength = 40) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
};

/**
 * Check if a user is online given the online users list
 */
export const isUserOnline = (userId, onlineUsers = []) => {
  return onlineUsers.includes(userId?.toString());
};
