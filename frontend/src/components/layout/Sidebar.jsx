import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useSocket } from "../../context/SocketContext";
import { userService } from "../../services/authService";
import {
  isUserOnline,
  formatConversationTime,
  truncate,
  getAvatarColor,
  getInitials,
} from "../../utils/helpers";
import Avatar from "../ui/Avatar";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { onlineUsers, connected } = useSocket();
  const {
    conversations,
    activeConversation,
    openConversation,
    loadingConversations,
  } = useChat();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [tab, setTab] = useState("chats"); // 'chats' | 'people'

  // Search users when query changes
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setSearching(true);
      try {
        const data = await userService.searchUsers(searchQuery);
        setSearchResults(data.users || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleOpenConversation = useCallback(
    (targetUser) => {
      openConversation(targetUser);
      setSearchQuery("");
      setSearchResults([]);
      setTab("chats");
    },
    [openConversation]
  );

  return (
    <aside className="w-72 lg:w-80 flex flex-col bg-void-800 border-r border-void-600 shrink-0">
      {/* App header */}
      <div className="px-5 py-4 border-b border-void-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-iris-400 to-electric-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="font-bold text-white text-sm tracking-tight">
              Nex<span className="text-gradient">Chat</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Connection status dot */}
            <div
              title={connected ? "Connected" : "Reconnecting..."}
              className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`}
            />
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 rounded-lg hover:bg-void-600 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Current user */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-void-700/60">
          <Avatar username={user?.username} size="sm" showOnline isOnline />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
            <p className="text-xs text-emerald-400 font-mono">● You</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-void-700">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-void-700 border border-void-600 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-iris-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setSearchResults([]); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      {!searchQuery && (
        <div className="flex border-b border-void-700 px-4">
          {["chats", "people"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                tab === t
                  ? "text-iris-400 border-b-2 border-iris-500"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Search results */}
        {searchQuery && (
          <div className="py-2">
            <p className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-widest">
              Users
            </p>
            {searching ? (
              <div className="flex justify-center py-6">
                <div className="w-5 h-5 border-2 border-iris-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : searchResults.length === 0 ? (
              <p className="px-4 py-4 text-sm text-gray-600 text-center">No users found</p>
            ) : (
              searchResults.map((u) => (
                <UserRow
                  key={u._id}
                  user={u}
                  isOnline={isUserOnline(u._id, onlineUsers)}
                  onClick={() => handleOpenConversation(u)}
                />
              ))
            )}
          </div>
        )}

        {/* Conversations list */}
        {!searchQuery && tab === "chats" && (
          <div className="py-2">
            {loadingConversations ? (
              <div className="flex justify-center py-8">
                <div className="w-5 h-5 border-2 border-iris-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-gray-500 text-sm">No conversations yet</p>
                <p className="text-gray-600 text-xs mt-1">Search for a user to start chatting</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const other = conv.otherUser ||
                  conv.participants?.find((p) => p._id !== user?._id);
                const isActive = activeConversation?._id === conv._id;
                const online = other ? isUserOnline(other._id, onlineUsers) : false;

                return (
                  <button
                    key={conv._id}
                    onClick={() => other && handleOpenConversation(other)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left hover:bg-void-700/60 ${
                      isActive ? "bg-void-700 border-l-2 border-iris-500" : "border-l-2 border-transparent"
                    }`}
                  >
                    {other && (
                      <Avatar username={other.username} size="md" showOnline isOnline={online} />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-200 truncate">
                          {other?.username || "Unknown"}
                        </span>
                        <span className="text-[10px] text-gray-600 font-mono shrink-0 ml-2">
                          {formatConversationTime(conv.lastMessage?.createdAt || conv.updatedAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {conv.lastMessage?.content
                          ? truncate(conv.lastMessage.content, 35)
                          : "Start a conversation"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* People / online users tab */}
        {!searchQuery && tab === "people" && (
          <OnlineUsersList onlineUsers={onlineUsers} currentUserId={user?._id} onSelect={handleOpenConversation} />
        )}
      </div>
    </aside>
  );
};

/** Simple user row for search results */
const UserRow = ({ user, isOnline, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-void-700/60 transition-colors text-left"
  >
    <Avatar username={user.username} size="md" showOnline isOnline={isOnline} />
    <div className="min-w-0">
      <p className="text-sm font-semibold text-gray-200 truncate">{user.username}</p>
      <p className={`text-xs font-mono ${isOnline ? "text-emerald-400" : "text-gray-600"}`}>
        {isOnline ? "● Online" : "● Offline"}
      </p>
    </div>
  </button>
);

/** Online users tab content - requires separate fetch */
const OnlineUsersList = ({ onlineUsers, currentUserId, onSelect }) => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    userService.searchUsers("").then((d) => setAllUsers(d.users || [])).catch(() => {});
  }, []);

  const online = allUsers.filter(
    (u) => onlineUsers.includes(u._id.toString()) && u._id !== currentUserId
  );
  const offline = allUsers.filter(
    (u) => !onlineUsers.includes(u._id.toString()) && u._id !== currentUserId
  );

  return (
    <div className="py-2">
      {online.length > 0 && (
        <>
          <p className="px-4 py-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            Online — {online.length}
          </p>
          {online.map((u) => (
            <UserRow key={u._id} user={u} isOnline onClick={() => onSelect(u)} />
          ))}
        </>
      )}
      {offline.length > 0 && (
        <>
          <p className="px-4 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2">
            Offline
          </p>
          {offline.map((u) => (
            <UserRow key={u._id} user={u} isOnline={false} onClick={() => onSelect(u)} />
          ))}
        </>
      )}
      {allUsers.length === 0 && (
        <p className="px-5 py-6 text-center text-sm text-gray-600">No other users yet</p>
      )}
    </div>
  );
};

export default Sidebar;
