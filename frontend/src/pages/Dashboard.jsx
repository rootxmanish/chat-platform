import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { useChat } from "../context/ChatContext";

/**
 * Main chat dashboard layout.
 * On mobile: toggle between sidebar and chat window.
 */
const Dashboard = () => {
  const { activeConversation } = useChat();
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="h-screen flex overflow-hidden bg-void-900">
      {/* Sidebar — always visible on desktop, toggleable on mobile */}
      <div
        className={`${
          showSidebar ? "flex" : "hidden"
        } md:flex h-full`}
      >
        <Sidebar />
      </div>

      {/* Chat window */}
      <div
        className={`${
          !showSidebar || activeConversation ? "flex" : "hidden"
        } md:flex flex-1 flex-col min-w-0`}
      >
        {/* Mobile back button */}
        <div className="md:hidden flex items-center px-4 py-2 border-b border-void-700 bg-void-800 shrink-0">
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 rounded-lg hover:bg-void-700 text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <ChatWindow />
      </div>
    </div>
  );
};

export default Dashboard;
