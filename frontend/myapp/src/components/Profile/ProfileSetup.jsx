import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button, Input } from '../Common';
import profileService from '../../services/profile';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ProfileSetup = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const isStudent = user?.role === 'student';

  const [formData, setFormData] = useState(
    isStudent ? {
      university: '',
      degree: '',
      specialization: '',
      currentYear: '',
      skills: [],
      interests: [],
      careerGoals: '',
      preferredIndustry: '',
    } : {
      university: '',
      degree: '',
      graduationYear: new Date().getFullYear(),
      company: '',
      designation: '',
      yearsOfExperience: '',
      industry: '',
      skills: [],
      mentoringAreas: [],
      bio: '',
    }
  );

  const [currentInput, setCurrentInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = (field) => {
    if (currentInput.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), currentInput.trim()]
      }));
      setCurrentInput('');
    }
  };

  const removeTag = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isStudent) {
        await profileService.createStudentProfile(formData);
      } else {
        await profileService.createAlumniProfile(formData);
      }
      toast.success('Profile created successfully!');
      navigate(isStudent ? '/student/dashboard' : '/alumni/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-gray-600">Help us match you with the right {isStudent ? 'mentors' : 'students'}</p>
      </div>

      <Card>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
            <span className="text-sm font-medium text-gray-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              className="bg-blue-600 h-2 rounded-full transition-all"
            ></motion.div>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
            <div className="space-y-4">
              <Input
                label="University"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="e.g., IIT Delhi"
              />
              <Input
                label="Degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g., B.Tech"
              />
              <Input
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
              />
              {isStudent && (
                <Input
                  label="Current Year"
                  name="currentYear"
                  value={formData.currentYear}
                  onChange={handleChange}
                  placeholder="e.g., 3"
                />
              )}
              {!isStudent && (
                <Input
                  label="Graduation Year"
                  name="graduationYear"
                  type="number"
                  value={formData.graduationYear}
                  onChange={handleChange}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Professional Info */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">
              {isStudent ? 'Career Goals' : 'Current Position'}
            </h2>
            <div className="space-y-4">
              {!isStudent && (
                <>
                  <Input
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g., Google"
                  />
                  <Input
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g., Senior Engineer"
                  />
                  <Input
                    label="Years of Experience"
                    name="yearsOfExperience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                  />
                  <Input
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g., Technology"
                  />
                </>
              )}
              {isStudent && (
                <>
                  <Input
                    label="Career Goals"
                    name="careerGoals"
                    value={formData.careerGoals}
                    onChange={handleChange}
                    placeholder="What are your career aspirations?"
                  />
                  <Input
                    label="Preferred Industry"
                    name="preferredIndustry"
                    value={formData.preferredIndustry}
                    onChange={handleChange}
                    placeholder="e.g., Technology, Finance"
                  />
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 3: Skills & Interests */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">Skills & {isStudent ? 'Interests' : 'Mentoring Areas'}</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Skills (Press Enter)
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag('skills')}
                    placeholder="Add a skill"
                  />
                  <Button onClick={() => addTag('skills')} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                      {skill}
                      <button onClick={() => removeTag('skills', idx)} className="font-bold">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add {isStudent ? 'Interests' : 'Mentoring Areas'}
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag(isStudent ? 'interests' : 'mentoringAreas')}
                    placeholder={`Add an ${isStudent ? 'interest' : 'area'}`}
                  />
                  <Button onClick={() => addTag(isStudent ? 'interests' : 'mentoringAreas')} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(isStudent ? formData.interests : formData.mentoringAreas).map((item, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2">
                      {item}
                      <button onClick={() => removeTag(isStudent ? 'interests' : 'mentoringAreas', idx)} className="font-bold">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {!isStudent && (
                <Input
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  as="textarea"
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            onClick={() => setStep(Math.max(1, step - 1))}
            variant="secondary"
            disabled={step === 1}
          >
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading}>
              Complete Profile
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfileSetup;