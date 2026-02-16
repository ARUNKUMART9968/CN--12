/**
 * Chat Routes
 * Manage conversations and chat sessions
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// ============ POST /api/chat/start ============
router.post('/start', authMiddleware, async (req, res) => {
  try {
    const { receiverId } = req.body;

    // Check if chat exists
    let chat = await Chat.findOne({
      users: { $all: [req.userId, receiverId] }
    });

    if (!chat) {
      // Create new chat
      chat = new Chat({
        users: [req.userId, receiverId],
        messages: [],
        isActive: true
      });
      await chat.save();
    }

    res.json({
      success: true,
      chat
    });

  } catch (error) {
    console.error('Start chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ GET /api/chat/list ============
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const chats = await Chat.find({ users: req.userId })
      .sort({ lastMessageTime: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Chat.countDocuments({ users: req.userId });

    res.json({
      success: true,
      chats,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ GET /api/chat/:chatId/messages ============
router.get('/:chatId/messages', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chatId: req.params.chatId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Mark messages as read
    await Message.updateMany(
      { chatId: req.params.chatId, receiverId: req.userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    const total = await Message.countDocuments({ chatId: req.params.chatId });

    res.json({
      success: true,
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ GET /api/chat/unread/count ============
router.get('/unread/count', authMiddleware, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiverId: req.userId,
      isRead: false
    });

    const chats = await Chat.find({ users: req.userId });
    const unreadByChat = await Promise.all(
      chats.map(async (chat) => ({
        chatId: chat._id,
        count: await Message.countDocuments({
          chatId: chat._id,
          receiverId: req.userId,
          isRead: false
        })
      }))
    );

    res.json({
      success: true,
      unreadCount,
      chats: unreadByChat.filter(c => c.count > 0)
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;