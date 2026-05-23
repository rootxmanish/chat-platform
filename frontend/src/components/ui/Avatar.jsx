import { getInitials, getAvatarColor } from "../../utils/helpers";

/**
 * Avatar component with initials fallback and online indicator
 */
const Avatar = ({ username = "", size = "md", showOnline = false, isOnline = false }) => {
  const sizes = {
    xs: "w-7 h-7 text-xs",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  const dotSizes = {
    xs: "w-2 h-2",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-3.5 h-3.5",
  };

  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={`${sizes[size]} rounded-full bg-gradient-to-br ${getAvatarColor(username)} flex items-center justify-center font-bold text-white select-none`}
      >
        {getInitials(username)}
      </div>
      {showOnline && (
        <span
          className={`absolute bottom-0 right-0 ${dotSizes[size]} rounded-full ring-2 ring-void-800 ${
            isOnline ? "bg-emerald-400" : "bg-gray-600"
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
