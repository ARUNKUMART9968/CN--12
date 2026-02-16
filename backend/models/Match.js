const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  scoreBreakdown: {
    university: { type: Number, default: 0 },
    industry: { type: Number, default: 0 },
    degree: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    interests: { type: Number, default: 0 },
    mentoring: { type: Number, default: 0 },
    company: { type: Number, default: 0 },
    availability: { type: Number, default: 0 }
  },
  commonSkills: [String],
  commonInterests: [String],
  matchingAreas: [String],
  matchRank: {
    type: Number,
    default: null
  },
  viewedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for quick queries
matchSchema.index({ studentId: 1, totalScore: -1 });
matchSchema.index({ alumniId: 1 });

module.exports = mongoose.model('Match', matchSchema);