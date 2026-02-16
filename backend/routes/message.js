/**
 * Message Routes
 * Send, read, and delete messages
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

// ============ POST /api/message/send ============
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { chatId, receiverId, text } = req.body;

    // Create message
    const message = new Message({
      chatId,
      senderId: req.userId,
      receiverId,
      text,
      isRead: false,
      createdAt: new Date()
    });

    await message.save();

    // Update chat
    await Chat.findByIdAndUpdate(
      chatId,
      {
        lastMessage: text,
        lastMessageTime: new Date()
      }
    );

    res.status(201).json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ PUT /api/message/:id/read ============
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ DELETE /api/message/:id ============
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only sender can delete
    if (message.senderId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Message deleted'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;