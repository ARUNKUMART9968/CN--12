/**
 * Career Nexus Backend Server
 * Clean version with correct CORS setup
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');

// Load env
dotenv.config();

// Init app
const app = express();
const server = http.createServer(app);

// ✅ Normalize CORS origin (REMOVE trailing slash)
const allowedOrigin = (process.env.CORS_ORIGIN || 'http://127.0.0.1:5501')
  .replace(/\/$/, '');

console.log("✅ CORS ORIGIN:", allowedOrigin);

// ============ SOCKET.IO ============
const io = socketio(server, {
  cors: {
    origin: allowedOrigin,
    credentials: true
  }
});

// ============ MIDDLEWARE ============

// Security
app.use(helmet());

// Compression
app.use(compression());

// ✅ EXPRESS CORS (IMPORTANT FIX)
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// Handle preflight explicitly (optional but safe)
app.options('*', cors());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// ============ DATABASE ============

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  }
};

connectDB();

// ============ ROUTES ============

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server running',
    time: new Date()
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/match', require('./routes/match'));
app.use('/api/connect', require('./routes/connection'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/message', require('./routes/message'));
app.use('/api/job', require('./routes/job'));

// ============ SOCKET LOGIC ============

const activeSockets = new Map();

io.on('connection', (socket) => {
  console.log('🔌 Connected:', socket.id);

  socket.on('user_connect', (userId) => {
    activeSockets.set(userId, socket.id);
    io.emit('user_online', { userId });
  });

  socket.on('send_message', (data) => {
    const receiverSocket = activeSockets.get(data.receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit('receive_message', {
        ...data,
        timestamp: new Date()
      });
    }
  });

  socket.on('disconnect', () => {
    for (let [userId, socketId] of activeSockets.entries()) {
      if (socketId === socket.id) {
        activeSockets.delete(userId);
        io.emit('user_offline', { userId });
        break;
      }
    }
  });
});

// ============ ERROR HANDLING ============

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message
  });
});

// ============ START SERVER ============

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});

module.exports = { app, io, server };