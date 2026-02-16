import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiUsers, FiMessageSquare, FiBriefcase, FiAward } from 'react-icons/fi';
import { Card, Loading } from '../Common';
import jobService from '../../services/job';
import toast from 'react-hot-toast';

const AlumniDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    studentsMatched: 0,
    jobsPosted: 0,
    messages: 0,
    connections: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await jobService.getAllJobs('open', 1, 5);
        setRecentApplications(response.data.jobs);
        setStats({
          studentsMatched: 24,
          jobsPosted: response.data.total,
          messages: 8,
          connections: 15,
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading fullScreen message="Loading your dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="pt-20">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your mentorship and job opportunities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Students Matched</p>
                <p className="text-3xl font-bold text-blue-600">{stats.studentsMatched}</p>
              </div>
              <FiUsers className="text-blue-600" size={40} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Jobs Posted</p>
                <p className="text-3xl font-bold text-green-600">{stats.jobsPosted}</p>
              </div>
              <FiBriefcase className="text-green-600" size={40} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Messages</p>
                <p className="text-3xl font-bold text-purple-600">{stats.messages}</p>
              </div>
              <FiMessageSquare className="text-purple-600" size={40} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Connections</p>
                <p className="text-3xl font-bold text-orange-600">{stats.connections}</p>
              </div>
              <FiAward className="text-orange-600" size={40} />
            </div>
          </Card>
        </div>

        {/* Your Jobs */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Your Job Postings</h2>
          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((job) => (
                <div key={job._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <div>
                    <p className="font-semibold">{job.title}</p>
                    <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{job.applicants?.length || 0}</p>
                    <p className="text-gray-600 text-xs">Applicants</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No jobs posted yet. <a href="/alumni/create-job" className="text-blue-600 hover:text-blue-700">Post your first job →</a></p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AlumniDashboard;