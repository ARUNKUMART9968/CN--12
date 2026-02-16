import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../Common';
import jobService from '../../services/job';
import toast from 'react-hot-toast';

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    jobType: 'Full-time',
    experienceLevel: 'Fresher',
    skillsRequired: [],
    deadline: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await jobService.createJob(formData);
      toast.success('Job posted successfully!');
      navigate('/alumni/my-jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      <h1 className="text-4xl font-bold mb-8">Post a Job</h1>

      <Card>
        <div className="space-y-4">
          <Input
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <Input
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            as="textarea"
          />
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                <option>Fresher</option>
                <option>Junior</option>
                <option>Mid-level</option>
                <option>Senior</option>
              </select>
            </div>
          </div>
          <Input
            label="Application Deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
          />

          <div className="flex gap-4 pt-4">
            <Button onClick={() => navigate(-1)} variant="secondary">Cancel</Button>
            <Button onClick={handleSubmit} loading={loading}>Post Job</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateJob;