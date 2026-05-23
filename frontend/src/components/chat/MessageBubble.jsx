import { formatMessageTime } from "../../utils/helpers";

/**
 * Individual message bubble
 * @param {boolean} isOwn - whether current user sent this message
 */
const MessageBubble = ({ message, isOwn, showAvatar }) => {
  return (
    <div className={`flex items-end gap-2 message-enter ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {/* Spacer to keep alignment when avatar is hidden */}
      <div className="w-6 shrink-0" />

      <div className={`max-w-[72%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        {/* Message bubble */}
        <div
          className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
            isOwn
              ? "bg-gradient-to-br from-iris-500 to-iris-600 text-white rounded-br-sm"
              : "bg-void-700 text-gray-100 rounded-bl-sm"
          }`}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-gray-600 mt-1 px-1 font-mono">
          {formatMessageTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
