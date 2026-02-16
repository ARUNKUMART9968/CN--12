import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Loading } from '../Common';
import matchingService from '../../services/matching';
import toast from 'react-hot-toast';

const Matches = () => {
  const { user } = useSelector(state => state.auth);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = user.role === 'student'
          ? await matchingService.getStudentRecommendations(user.id, page)
          : await matchingService.getAlumniMatches(user.id, page);
        setMatches(response.data.recommendations);
      } catch (error) {
        toast.error('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user.id, page, user.role]);

  if (loading) return <Loading fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      <h1 className="text-4xl font-bold mb-8">Your Matches</h1>

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <Card key={match._id} hover>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{match.alumni_name || match.student_name}</h3>
                  <p className="text-gray-600">{match.company}</p>
                </div>
                <div className="text-right bg-blue-100 px-3 py-1 rounded-full">
                  <p className="font-bold text-blue-600">{match.total_score}</p>
                  <p className="text-xs text-gray-600">Match Score</p>
                </div>
              </div>

              {match.common_skills && match.common_skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Common Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {match.common_skills.map((skill, idx) => (
                      <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                View Details
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">No matches found yet. Complete your profile for recommendations!</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Matches;