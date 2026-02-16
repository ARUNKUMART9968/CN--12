import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiEdit, FiMapPin, FiBriefcase, FiGithub, FiLinkedin } from 'react-icons/fi';
import { Card, Loading, Button } from '../Common';
import profileService from '../../services/profile';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const { user } = useSelector(state => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await profileService.getStudentProfile(user.id);
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

      {/* Basic Info */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <p className="text-lg">{profile.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <p className="text-lg">{profile.email}</p>
          </div>
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
            <p className="text-lg">{profile.specialization || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Year</label>
            <p className="text-lg">{profile.currentYear}</p>
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills && profile.skills.map((skill, idx) => (
            <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </Card>

      {/* Interests */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {profile.interests && profile.interests.map((interest, idx) => (
            <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {interest}
            </span>
          ))}
        </div>
      </Card>

      {/* Projects */}
      {profile.projects && profile.projects.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          <div className="space-y-4">
            {profile.projects.map((project, idx) => (
              <div key={idx} className="border-l-4 border-blue-600 pl-4 py-2">
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-gray-600">{project.description}</p>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Social Links */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Social Links</h2>
        <div className="flex gap-4">
          {profile.githubProfile && (
            <a href={profile.githubProfile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <FiGithub size={24} />
              GitHub
            </a>
          )}
          {profile.linkedinProfile && (
            <a href={profile.linkedinProfile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <FiLinkedin size={24} />
              LinkedIn
            </a>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudentProfile;