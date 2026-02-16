import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../Common';
import profileService from '../../services/profile';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});

  const isStudent = user?.role === 'student';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = isStudent
          ? await profileService.getStudentProfile(user.id)
          : await profileService.getAlumniProfile(user.id);
        setProfile(response.data.profile);
        setFormData(response.data.profile);
      } catch (error) {
        toast.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, [user.id, isStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isStudent) {
        await profileService.updateStudentProfile(formData);
      } else {
        await profileService.updateAlumniProfile(formData);
      }
      toast.success('Profile updated successfully!');
      navigate(isStudent ? '/student/profile' : '/alumni/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      <h1 className="text-4xl font-bold mb-8">Edit Profile</h1>

      <Card>
        <div className="space-y-6">
          <Input
            label="Skills (comma-separated)"
            value={formData.skills?.join(', ') || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))}
          />
          
          <Input
            label={isStudent ? 'Interests' : 'Mentoring Areas'}
            value={formData[isStudent ? 'interests' : 'mentoringAreas']?.join(', ') || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              [isStudent ? 'interests' : 'mentoringAreas']: e.target.value.split(',').map(s => s.trim()) 
            }))}
          />

          {isStudent && (
            <Input
              label="Career Goals"
              value={formData.careerGoals || ''}
              onChange={handleChange}
              name="careerGoals"
            />
          )}

          {!isStudent && (
            <Input
              label="Bio"
              value={formData.bio || ''}
              onChange={handleChange}
              name="bio"
              as="textarea"
            />
          )}

          <div className="flex gap-4 pt-6 border-t">
            <Button onClick={() => navigate(-1)} variant="secondary">Cancel</Button>
            <Button onClick={handleSubmit} loading={loading}>Save Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EditProfile;