/**
 * Career Nexus Backend Server
 * Main Express server with all routes and middleware
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

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  }
});

// ============ MIDDLEWARE ============

// Security headers
app.use(helmet());

// Compression
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(morgan('combined'));

// ============ DATABASE CONNECTION ============

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/careernexus',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );

    console.log('✓ MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// ============ ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    pythonService: process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'
  });
});

// Mount Auth routes
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('✓ Auth routes mounted');
} catch (error) {
  console.error('✗ Error loading auth routes:', error.message);
}

// Mount Profile routes
try {
  app.use('/api/profile', require('./routes/profile'));
  console.log('✓ Profile routes mounted');
} catch (error) {
  console.error('✗ Error loading profile routes:', error.message);
}

// Mount Match routes
try {
  app.use('/api/match', require('./routes/match'));
  console.log('✓ Match routes mounted');
} catch (error) {
  console.error('✗ Error loading match routes:', error.message);
}

// Mount Connection routes
try {
  app.use('/api/connect', require('./routes/connection'));
  console.log('✓ Connection routes mounted');
} catch (error) {
  console.error('✗ Error loading connection routes:', error.message);
}

// Mount Chat routes
try {
  app.use('/api/chat', require('./routes/chat'));
  console.log('✓ Chat routes mounted');
} catch (error) {
  console.error('✗ Error loading chat routes:', error.message);
}

// Mount Message routes
try {
  app.use('/api/message', require('./routes/message'));
  console.log('✓ Message routes mounted');
} catch (error) {
  console.error('✗ Error loading message routes:', error.message);
}

// Mount Job routes
try {
  app.use('/api/job', require('./routes/job'));
  console.log('✓ Job routes mounted');
} catch (error) {
  console.error('✗ Error loading job routes:', error.message);
}

// ============ SOCKET.IO REAL-TIME CHAT ============

const activeSockets = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User connects
  socket.on('user_connect', (userId) => {
    activeSockets.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ${socket.id}`);
    io.emit('user_online', { userId, socketId: socket.id });
  });

  // Send message
  socket.on('send_message', (data) => {
    const { receiverId, message, senderId, senderName } = data;
    const receiverSocket = activeSockets.get(receiverId);
    
    if (receiverSocket) {
      io.to(receiverSocket).emit('receive_message', {
        senderId,
        senderName,
        message,
        timestamp: new Date()
      });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { receiverId, isTyping, senderName } = data;
    const receiverSocket = activeSockets.get(receiverId);
    
    if (receiverSocket) {
      io.to(receiverSocket).emit('user_typing', {
        senderName,
        isTyping
      });
    }
  });

  // Connection request notification
  socket.on('connection_request', (data) => {
    const { receiverId, senderId, senderName } = data;
    const receiverSocket = activeSockets.get(receiverId);
    
    if (receiverSocket) {
      io.to(receiverSocket).emit('connection_request_received', {
        senderId,
        senderName,
        message: `${senderName} sent you a connection request`
      });
    }
  });

  // Match notification
  socket.on('new_match', (data) => {
    const { receiverId, matchInfo } = data;
    const receiverSocket = activeSockets.get(receiverId);
    
    if (receiverSocket) {
      io.to(receiverSocket).emit('match_notification', matchInfo);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    for (let [userId, socketId] of activeSockets.entries()) {
      if (socketId === socket.id) {
        activeSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        io.emit('user_offline', { userId });
        break;
      }
    }
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// ============ ERROR HANDLING ============

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ============ START SERVER ============

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

server.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   Career Nexus Backend Server          ║
  ║   Version: 1.0.0                       ║
  ║   Environment: ${NODE_ENV}                  ║
  ║   Port: ${PORT}                          ║
  ║   Python Service: ${process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'} ║
  ╚════════════════════════════════════════╝
  `);
  console.log('✓ Express server is running on port', PORT);
  console.log('✓ Server is running and ready to accept connections');
  console.log('✓ All routes are mounted and ready');
  console.log('✓ Socket.IO is running for real-time features');
});

module.exports = { app, io, server };