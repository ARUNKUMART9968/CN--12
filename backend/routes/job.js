/**
 * Job Routes
 * Manage job postings and applications
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Job = require('../models/Job');

// ============ POST /api/job/create ============
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, company, description, location, jobType, experienceLevel, skillsRequired, salary, deadline } = req.body;

    const job = new Job({
      alumniId: req.userId,
      title,
      company,
      description,
      location,
      jobType,
      experienceLevel,
      skillsRequired: skillsRequired || [],
      salary,
      deadline,
      applicants: [],
      status: 'open'
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ GET /api/job/list ============
router.get('/list', async (req, res) => {
  try {
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const jobs = await Job.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ GET /api/job/:jobId ============
router.get('/:jobId', async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      job
    });

  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ POST /api/job/:jobId/apply ============
router.post('/:jobId/apply', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.find(app => app.studentId.toString() === req.userId);
    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'Already applied for this job'
      });
    }

    // Add applicant
    job.applicants.push({
      studentId: req.userId,
      appliedAt: new Date(),
      status: 'pending'
    });

    await job.save();

    res.json({
      success: true,
      message: 'Applied successfully'
    });

  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ GET /api/job/:jobId/applicants ============
router.get('/:jobId/applicants', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      applicants: job.applicants,
      total: job.applicants.length
    });

  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ PUT /api/job/:jobId/applicants/:studentId ============
router.put('/:jobId/applicants/:studentId', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Find and update applicant
    const applicant = job.applicants.find(app => app.studentId.toString() === req.params.studentId);
    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found'
      });
    }

    applicant.status = status;
    await job.save();

    res.json({
      success: true,
      message: 'Applicant status updated',
      applicant
    });

  } catch (error) {
    console.error('Update applicant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;