import { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { isUserOnline, formatLastSeen } from "../../utils/helpers";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import Avatar from "../ui/Avatar";

const ChatWindow = () => {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const {
    activeConversation,
    messages,
    loadingMessages,
    typingUsers,
    sendMessage,
    emitTyping,
  } = useChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const otherUser =
    activeConversation?.otherUser ||
    activeConversation?.participants?.find((p) => p._id !== user?._id);

  const conversationId = activeConversation?._id;
  const isTyping = typingUsers[conversationId];
  const partnerOnline = otherUser ? isUserOnline(otherUser._id, onlineUsers) : false;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when conversation changes
  useEffect(() => {
    if (activeConversation) {
      inputRef.current?.focus();
    }
  }, [activeConversation]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    await sendMessage(trimmed);
  }, [input, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value && otherUser && conversationId) {
      emitTyping(conversationId, otherUser._id);
    }
  };

  // Empty state - no conversation selected
  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-void-900 gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-void-800 flex items-center justify-center">
          <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-gray-400 font-medium">No conversation selected</p>
          <p className="text-gray-600 text-sm mt-1">Choose someone to chat with</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-void-900 min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-void-700 bg-void-800/50 backdrop-blur-sm shrink-0">
        {otherUser && (
          <>
            <Avatar
              username={otherUser.username}
              size="md"
              showOnline
              isOnline={partnerOnline}
            />
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate">
                {otherUser.username}
              </p>
              <p className="text-xs font-mono text-gray-500">
                {partnerOnline
                  ? "● Online"
                  : `Last seen ${formatLastSeen(otherUser.lastSeen)}`}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 min-h-0">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-iris-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 animate-fade-in">
            <Avatar username={otherUser?.username} size="xl" />
            <div className="text-center">
              <p className="text-gray-300 font-semibold">{otherUser?.username}</p>
              <p className="text-gray-600 text-sm mt-1">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, idx) => {
              const isOwn = message.sender?._id === user?._id ||
                message.sender === user?._id;
              const prevMessage = messages[idx - 1];
              const showAvatar =
                !isOwn &&
                (!prevMessage || prevMessage.sender?._id !== message.sender?._id);

              return (
                <MessageBubble
                  key={message._id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                />
              );
            })}
            {isTyping && (
              <TypingIndicator username={otherUser?.username} />
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="px-4 py-4 border-t border-void-700 bg-void-800/30 shrink-0">
        <div className="flex items-end gap-3 bg-void-700 rounded-2xl px-4 py-3 border border-void-600 focus-within:border-iris-500/50 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${otherUser?.username || ""}…`}
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder:text-gray-600 resize-none focus:outline-none leading-relaxed max-h-32 font-sans"
            style={{ scrollbarWidth: "none" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 w-8 h-8 rounded-xl bg-iris-500 hover:bg-iris-400 disabled:bg-void-600 disabled:text-gray-600 flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed text-white"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-700 text-center mt-2 font-mono">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
