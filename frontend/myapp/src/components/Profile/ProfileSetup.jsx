// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIX FOR PROFILE CREATION ERROR
// File: src/components/Profile/ProfileSetup.jsx (or ProfileCreate.jsx)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import profileService from '../../services/profile';
import toast from 'react-hot-toast';
import { FiCamera } from 'react-icons/fi';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    university: '',
    degree: '',
    skills: [],
    interests: [],
    industry: '',
    yearsOfExperience: 0,
    currentYear: 1,
    careerGoals: '',
    phone: '',
    location: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = (skill) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // ✅ CORRECT: Use createProfile for NEW profile creation
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.bio || !formData.university || !formData.degree) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await profileService.createProfile(formData);
      
      toast.success('Profile created successfully!');
      console.log('Profile created:', response.data);
      
      // Navigate to dashboard after successful creation
      if (user?.role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/alumni/dashboard');
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pt-28">
      <h1 className="text-3xl font-bold mb-6">Setup Your Profile</h1>
      
      <form onSubmit={handleCreateProfile} className="space-y-6">
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-2">Bio *</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* University */}
        <div>
          <label className="block text-sm font-medium mb-2">University *</label>
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleInputChange}
            placeholder="Your University"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Degree */}
        <div>
          <label className="block text-sm font-medium mb-2">Degree *</label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleInputChange}
            placeholder="Your Degree"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium mb-2">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              id="skillInput"
              placeholder="Add a skill and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(e.target.value);
                  e.target.value = '';
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Other fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              placeholder="Your Industry"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Career Goals */}
        <div>
          <label className="block text-sm font-medium mb-2">Career Goals</label>
          <textarea
            name="careerGoals"
            value={formData.careerGoals}
            onChange={handleInputChange}
            placeholder="What are your career goals?"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
        >
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KEY FIX POINTS:
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. Use: profileService.createProfile(formData)
//    NOT: profileService.updateProfile(userId, formData)
//
// 2. Don't include userId in createProfile call
//    Backend gets userId from authenticated session
//
// 3. Check error.response?.data?.message for detailed error info
//
// 4. Navigate after successful creation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━