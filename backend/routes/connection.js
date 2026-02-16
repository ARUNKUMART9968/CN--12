/**
 * Connection Routes
 * Manage connection requests between users
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Connection = require('../models/Connection');

// ============ POST /api/connect/send ============
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { receiverId } = req.body;

    // Check if connection already exists
    let connection = await Connection.findOne({
      $or: [
        { senderId: req.userId, receiverId },
        { senderId: receiverId, receiverId: req.userId }
      ]
    });

    if (connection) {
      return res.status(400).json({
        success: false,
        message: 'Connection already exists'
      });
    }

    // Create connection
    connection = new Connection({
      senderId: req.userId,
      receiverId,
      status: 'pending'
    });

    await connection.save();

    res.status(201).json({
      success: true,
      message: 'Connection request sent',
      connection
    });

  } catch (error) {
    console.error('Send connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ PUT /api/connect/accept/:id ============
router.put('/accept/:id', authMiddleware, async (req, res) => {
  try {
    const connection = await Connection.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted', connectedAt: new Date() },
      { new: true }
    );

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    res.json({
      success: true,
      message: 'Connection accepted',
      connection
    });

  } catch (error) {
    console.error('Accept connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ PUT /api/connect/reject/:id ============
router.put('/reject/:id', authMiddleware, async (req, res) => {
  try {
    const connection = await Connection.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    res.json({
      success: true,
      message: 'Connection rejected',
      connection
    });

  } catch (error) {
    console.error('Reject connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ GET /api/connect/list ============
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {
      $or: [
        { senderId: req.userId },
        { receiverId: req.userId }
      ]
    };

    if (status) {
      query.status = status;
    }

    const connections = await Connection.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Connection.countDocuments(query);

    res.json({
      success: true,
      connections,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ GET /api/connect/pending ============
router.get('/pending', authMiddleware, async (req, res) => {
  try {
    const pending = await Connection.find({
      receiverId: req.userId,
      status: 'pending'
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      pending,
      count: pending.length
    });

  } catch (error) {
    console.error('Get pending connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;