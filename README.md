# NexChat — Real-time Anonymous Chat App

A full-stack real-time chat application built with React, Node.js, Socket.IO, and MongoDB Atlas. Portfolio-grade anonymous chatting with JWT authentication, typing indicators, and online presence.

---

## ✨ Features

- **Real-time messaging** via Socket.IO WebSockets
- **Online/offline status** with live presence tracking
- **Typing indicators** with auto-timeout
- **User search** with instant results
- **Persistent chat history** stored in MongoDB
- **JWT authentication** with bcrypt password hashing
- **Dark, minimal UI** with Tailwind CSS + Syne font
- **Mobile responsive** layout
- **Production-ready** architecture

---

## 🗂️ Project Structure

```
chatapp/
├── backend/
│   ├── server.js              # Entry point + Socket.IO init
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js             # Express app setup
│       ├── config/db.js       # MongoDB connection
│       ├── models/
│       │   ├── User.js
│       │   ├── Message.js
│       │   └── Conversation.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── userController.js
│       │   └── messageController.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── userRoutes.js
│       │   └── messageRoutes.js
│       ├── middleware/
│       │   ├── auth.js        # JWT protect middleware
│       │   └── errorHandler.js
│       ├── sockets/
│       │   └── socketHandler.js
│       └── services/
│           └── tokenService.js
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── .env.example
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── context/
        │   ├── AuthContext.jsx     # Auth state + JWT
        │   ├── SocketContext.jsx   # Socket.IO connection
        │   └── ChatContext.jsx     # Conversation + messages
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Dashboard.jsx
        ├── components/
        │   ├── ui/Avatar.jsx
        │   ├── chat/ChatWindow.jsx
        │   ├── chat/MessageBubble.jsx
        │   ├── chat/TypingIndicator.jsx
        │   └── layout/Sidebar.jsx
        ├── services/
        │   ├── api.js             # Axios instance
        │   └── authService.js     # API call wrappers
        ├── routes/
        │   └── ProtectedRoute.jsx
        └── utils/helpers.js
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env   # Fill in your values

# Frontend
cd ../frontend
npm install
cp .env.example .env   # Fill in your values
```

### 2. Configure Environment

**backend/.env**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.xxxxx.mongodb.net/chatapp
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/users` | Yes | Search users (`?search=`) |
| GET | `/api/users/conversations` | Yes | Get sidebar conversations |
| GET | `/api/users/:id` | Yes | Get user profile |
| POST | `/api/messages/send` | Yes | Send a message |
| POST | `/api/messages/conversation` | Yes | Get or create conversation |
| GET | `/api/messages/:conversationId` | Yes | Get paginated messages |

---

## 🔌 Socket Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `connection` | Client→Server | JWT in `auth` | Authenticate socket |
| `send-message` | Client→Server | `{receiverId, message, conversationId}` | Send to recipient |
| `receive-message` | Server→Client | `{message, conversationId}` | Incoming message |
| `typing` | Client→Server | `{receiverId, conversationId}` | Start typing |
| `stop-typing` | Client→Server | `{receiverId, conversationId}` | Stop typing |
| `online-users` | Server→Client | `[userId, ...]` | Broadcast presence |
| `disconnect` | Client→Server | — | Mark user offline |

---

## 🚢 Deployment on Render

### Backend (Web Service)
1. Create a **Web Service** on Render
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `backend/.env`

### Frontend (Static Site)
1. Create a **Static Site** on Render
2. Root directory: `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Add environment variables:
   - `VITE_API_URL` = your backend URL + `/api`
   - `VITE_SOCKET_URL` = your backend URL

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express 4 |
| Real-time | Socket.IO 4 |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| Deployment | Render |

---

## 🔐 Security Features

- bcrypt password hashing (12 rounds)
- JWT with configurable expiry
- Express Helmet security headers
- Rate limiting (100/15min general, 20/15min auth)
- Request body size limit (10kb)
- CORS restricted to frontend origin
- Socket.IO JWT authentication middleware
- Input validation with express-validator

---

## 📝 License

MIT — Free to use for portfolio and educational purposes.
