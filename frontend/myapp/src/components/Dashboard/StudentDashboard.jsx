import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiUsers, FiMessageSquare, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import { Card, Loading } from '../Common';
import matchingService from '../../services/matching';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    matches: 0,
    connections: 0,
    messages: 0,
    applications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentMatches, setRecentMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await matchingService.getStudentRecommendations(user.id, 1, 5);
        setRecentMatches(response.data.recommendations);
        setStats({
          matches: response.data.total,
          connections: 12,
          messages: 5,
          applications: 3,
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

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
            Here's your career journey overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Matches Found</p>
                <p className="text-3xl font-bold text-blue-600">{stats.matches}</p>
              </div>
              <FiTrendingUp className="text-blue-600" size={40} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Connections</p>
                <p className="text-3xl font-bold text-green-600">{stats.connections}</p>
              </div>
              <FiUsers className="text-green-600" size={40} />
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
                <p className="text-gray-600 text-sm font-medium">Applications</p>
                <p className="text-3xl font-bold text-orange-600">{stats.applications}</p>
              </div>
              <FiBriefcase className="text-orange-600" size={40} />
            </div>
          </Card>
        </div>

        {/* Recent Matches */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Recent Matches</h2>
          {recentMatches.length > 0 ? (
            <div className="space-y-4">
              {recentMatches.map((match) => (
                <div key={match._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <div>
                    <p className="font-semibold">{match.alumni_name}</p>
                    <p className="text-gray-600 text-sm">{match.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{match.total_score}</p>
                    <p className="text-gray-600 text-xs">Match Score</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No matches yet. Complete your profile to get recommendations!</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;