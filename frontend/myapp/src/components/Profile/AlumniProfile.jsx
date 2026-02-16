import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiEdit, FiBriefcase, FiLinkedin, FiTwitter, FiGlobe } from 'react-icons/fi';
import { Card, Loading, Button, Badge } from '../Common';
import profileService from '../../services/profile';
import toast from 'react-hot-toast';

const AlumniProfile = () => {
  const { user } = useSelector(state => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await profileService.getAlumniProfile(user.id);
        setProfile(response.data.profile);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.id]);

  if (loading) return <Loading fullScreen message="Loading profile..." />;

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No profile created yet</p>
            <Button>Create Profile</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Profile</h1>
        <Button>
          <FiEdit className="mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Current Position */}
      <Card className="mb-6 border-l-4 border-blue-600">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{profile.designation}</h2>
            <p className="text-xl text-gray-600 mb-4">{profile.company}</p>
            <div className="flex gap-4">
              <Badge variant="primary">{profile.yearsOfExperience} years experience</Badge>
              <Badge variant="success">{profile.industry}</Badge>
              <Badge variant="warning">{profile.availability}</Badge>
            </div>
          </div>
          <FiBriefcase size={64} className="text-blue-600 opacity-20" />
        </div>
      </Card>

      {/* Education */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
            <p className="text-lg">{profile.university}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
            <p className="text-lg">{profile.degree}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
            <p className="text-lg">{profile.specialization}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
            <p className="text-lg">{profile.graduationYear}</p>
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Technical Skills</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills && profile.skills.map((skill, idx) => (
            <Badge key={idx} variant="primary">{skill}</Badge>
          ))}
        </div>
      </Card>

      {/* Mentoring Areas */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Mentoring Areas</h2>
        <div className="flex flex-wrap gap-2">
          {profile.mentoringAreas && profile.mentoringAreas.map((area, idx) => (
            <Badge key={idx} variant="success">{area}</Badge>
          ))}
        </div>
      </Card>

      {/* Bio */}
      {profile.bio && (
        <Card className="mb-6">
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
        </Card>
      )}

      {/* Social Links */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Connect With Me</h2>
        <div className="flex gap-4">
          {profile.linkedinProfile && (
            <a href={profile.linkedinProfile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <FiLinkedin size={24} />
              LinkedIn
            </a>
          )}
          {profile.twitterProfile && (
            <a href={profile.twitterProfile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <FiTwitter size={24} />
              Twitter
            </a>
          )}
          {profile.websiteUrl && (
            <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <FiGlobe size={24} />
              Website
            </a>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AlumniProfile;