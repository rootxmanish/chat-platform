/**
 * Animated typing indicator (three bouncing dots)
 */
const TypingIndicator = ({ username }) => {
  return (
    <div className="flex items-end gap-2 animate-fade-in px-4 py-1">
      <div className="bg-void-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 0.2, 0.4].map((delay, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            style={{
              animation: `bounceDots 1.4s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
      {username && (
        <span className="text-xs text-gray-600 mb-1 font-mono">{username} is typing…</span>
      )}
    </div>
  );
};

export default TypingIndicator;
