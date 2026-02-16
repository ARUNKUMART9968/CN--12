import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Loading, Button } from '../Common';
import matchingService from '../../services/matching';
import connectionService from '../../services/connection';
import toast from 'react-hot-toast';

const Matches = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMatches, setTotalMatches] = useState(0);

  useEffect(() => {
    fetchMatches();
  }, [page]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      let response;
      
      if (user?.role === 'student') {
        response = await matchingService.getStudentRecommendations(user.id, page, 10);
      } else {
        response = await matchingService.getAlumniMatches(user.id, page, 10);
      }
      
      console.log('Matches response:', response.data);
      
      setMatches(response.data.recommendations || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalMatches(response.data.total || 0);
    } catch (error) {
      console.error('Failed to load matches:', error);
      toast.error(error.response?.data?.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (matchId) => {
    navigate(`/student/match/${matchId}`, {
      state: { match: matchId }
    });
  };

  const handleConnect = async (receiverId) => {
    try {
      await connectionService.sendRequest(receiverId);
      toast.success('Connection request sent!');
      // Refresh matches
      fetchMatches();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const handleChat = async (receiverId, receiverName) => {
    try {
      // Start chat and navigate
      const response = await chatService.startChat(receiverId);
      navigate(`/student/chat/${response.data.chat._id}`, {
        state: { chatId: response.data.chat._id, receiverName }
      });
    } catch (error) {
      console.error('Failed to start chat:', error);
      toast.error('Failed to start chat');
    }
  };

  if (loading) return <Loading fullScreen message="Loading your matches..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Matches</h1>
        <p className="text-gray-600">
          {totalMatches} {user?.role === 'student' ? 'mentors found' : 'students matched'}
        </p>
      </div>

      {matches && matches.length > 0 ? (
        <>
          {/* Matches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {matches.map((match) => (
              <Card key={match._id || match.alumni_id || match.student_id} hover className="flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">
                      {match.alumni_name || match.student_name || 'Unknown'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {match.company || match.designation || 'Professional'}
                    </p>
                  </div>
                  
                  {/* Score Badge */}
                  <div className="bg-blue-100 px-3 py-1 rounded-full text-center ml-2">
                    <p className="font-bold text-blue-600 text-sm">
                      {Math.round(match.total_score || match.matchScore || 0)}
                    </p>
                    <p className="text-xs text-gray-600">Match</p>
                  </div>
                </div>

                {/* Common Skills */}
                {match.common_skills && match.common_skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Common Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {match.common_skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {match.common_skills.length > 3 && (
                        <span className="text-xs text-gray-600 px-2 py-1">
                          +{match.common_skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Score Breakdown */}
                {match.score_breakdown && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="text-gray-600">University</p>
                        <p className="font-bold text-blue-600">
                          {Math.round(match.score_breakdown.university || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Skills</p>
                        <p className="font-bold text-green-600">
                          {Math.round(match.score_breakdown.skills || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Interests</p>
                        <p className="font-bold text-purple-600">
                          {Math.round(match.score_breakdown.interests || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto pt-4">
                  <Button
                    onClick={() => handleViewDetails(match._id || match.alumni_id || match.student_id)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Details
                  </Button>
                  <Button
                    onClick={() => handleConnect(match.alumni_id || match.student_id)}
                    size="sm"
                    className="flex-1"
                  >
                    Connect
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                variant="secondary"
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded-lg transition ${
                      page === p
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                variant="secondary"
              >
                Next
              </Button>
            </div>
          )}

          {/* Results Info */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Showing page {page} of {totalPages}
          </p>
        </>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {user?.role === 'student' 
                ? "No mentors found yet. Complete your profile for recommendations!"
                : "No students found yet. Check back later!"}
            </p>
            {user?.role === 'student' && (
              <Button onClick={() => navigate('/student/profile/edit')}>
                Complete Profile
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Matches;