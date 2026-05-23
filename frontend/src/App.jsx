import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ChatProvider } from "./context/ChatContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ChatProvider>
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#1c1c26",
                  color: "#e5e7eb",
                  border: "1px solid rgba(139,92,246,0.25)",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "13px",
                },
                success: {
                  iconTheme: { primary: "#a78bfa", secondary: "#1c1c26" },
                },
                error: {
                  iconTheme: { primary: "#f87171", secondary: "#1c1c26" },
                },
                duration: 3000,
              }}
            />

            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ChatProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
