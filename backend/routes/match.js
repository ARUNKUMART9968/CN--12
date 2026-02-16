/**
 * Matching Routes
 * Run GBHM algorithm and get recommendations
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const Match = require('../models/Match');
const StudentProfile = require('../models/StudentProfile');
const AlumniProfile = require('../models/AlumniProfile');

// ============ POST /api/match/run ============
router.post('/run', authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.body;

    // Get student profile
    const studentProfile = await StudentProfile.findOne({ userId: studentId });
    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Get all alumni profiles
    const alumniProfiles = await AlumniProfile.find();
    if (alumniProfiles.length === 0) {
      return res.json({
        success: true,
        message: 'No alumni available for matching',
        matches: []
      });
    }

    // Call Python GBHM service
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
    
    const matchingResponse = await axios.post(`${pythonServiceUrl}/api/match`, {
      student: {
        id: studentProfile._id,
        userId: studentProfile.userId,
        name: studentProfile.name,
        university: studentProfile.university,
        degree: studentProfile.degree,
        preferred_industry: studentProfile.preferredIndustry,
        skills: studentProfile.skills,
        interests: studentProfile.interests,
        looking_for: studentProfile.lookingFor,
        location: studentProfile.location
      },
      alumni_list: alumniProfiles.map(alumni => ({
        id: alumni._id,
        userId: alumni.userId,
        name: alumni.name,
        university: alumni.university,
        degree: alumni.degree,
        industry: alumni.industry,
        skills: alumni.skills,
        interests: alumni.interests,
        mentoring_areas: alumni.mentoringAreas,
        company: alumni.company,
        availability: alumni.availability,
        hiring_stack: alumni.hiringStack,
        location: alumni.location
      }))
    });

    // Save matches to database
    for (const match of matchingResponse.data.matches) {
      await Match.findOneAndUpdate(
        { studentId: studentId, alumniId: match.alumni_id },
        {
          studentId: studentId,
          alumniId: match.alumni_id,
          totalScore: match.total_score,
          scoreBreakdown: match.score_breakdown,
          commonSkills: match.score_breakdown.common_skills || [],
          commonInterests: match.score_breakdown.common_interests || [],
          matchingAreas: match.score_breakdown.matching_areas || []
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      message: 'Matching completed',
      matches: matchingResponse.data.matches
    });

  } catch (error) {
    console.error('Matching error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during matching',
      error: error.message
    });
  }
});

// ============ GET /api/match/student/:id ============
router.get('/student/:id', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const matches = await Match.find({ studentId: req.params.id })
      .sort({ totalScore: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Match.countDocuments({ studentId: req.params.id });

    res.json({
      success: true,
      recommendations: matches,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get student matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ GET /api/match/alumni/:id ============
router.get('/alumni/:id', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const matches = await Match.find({ alumniId: req.params.id })
      .sort({ totalScore: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Match.countDocuments({ alumniId: req.params.id });

    res.json({
      success: true,
      matches,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get alumni matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============ GET /api/match/:studentId/:alumniId ============
router.get('/:studentId/:alumniId', async (req, res) => {
  try {
    const match = await Match.findOneAndUpdate(
      { studentId: req.params.studentId, alumniId: req.params.alumniId },
      { viewed: true, viewedAt: new Date() },
      { new: true }
    );

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.json({
      success: true,
      match
    });

  } catch (error) {
    console.error('Get match details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;