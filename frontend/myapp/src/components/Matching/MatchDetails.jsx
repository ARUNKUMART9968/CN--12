import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Loading, Button, Badge } from '../Common';
import { FiArrowLeft, FiMessageSquare, FiUserPlus } from 'react-icons/fi';
import matchingService from '../../services/matching';
import connectionService from '../../services/connection';
import chatService from '../../services/chat';
import toast from 'react-hot-toast';

const MatchDetails = () => {
  const { id } = useParams();
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [chatting, setChatting] = useState(false);

  useEffect(() => {
    fetchMatchDetails();
  }, [id]);

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      const response = await matchingService.getMatchDetails(
        user.id,
        id
      );
      
      console.log('Match details:', response.data);
      
      setMatch(response.data);
    } catch (error) {
      console.error('Failed to load match details:', error);
      toast.error(error.response?.data?.message || 'Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const receiverId = match.alumni_id || match.student_id || id;
      await connectionService.sendRequest(receiverId);
      toast.success('Connection request sent!');
      navigate('/student/matches');
    } catch (error) {
      console.error('Failed to send connection request:', error);
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setConnecting(false);
    }
  };

  const handleStartChat = async () => {
    setChatting(true);
    try {
      const receiverId = match.alumni_id || match.student_id || id;
      const response = await chatService.startChat(receiverId);
      
      if (response.data && response.data.chat) {
        toast.success('Chat started!');
        navigate(`/student/chat/${response.data.chat._id}`);
      }
    } catch (error) {
      console.error('Failed to start chat:', error);
      toast.error(error.response?.data?.message || 'Failed to start chat');
    } finally {
      setChatting(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading match details..." />;

  if (!match) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Match not found</p>
            <Button onClick={() => navigate('/student/matches')}>
              Back to Matches
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const matchName = match.alumni_name || match.student_name || 'Unknown';
  const matchCompany = match.company || match.designation || 'Professional';
  const totalScore = Math.round(match.total_score || match.matchScore || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/matches')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <FiArrowLeft size={20} />
        Back to Matches
      </button>

      {/* Main Card */}
      <Card className="mb-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 pb-6 border-b">
          <div>
            <h1 className="text-4xl font-bold mb-2">{matchName}</h1>
            <p className="text-xl text-gray-600 mb-2">{matchCompany}</p>
            <p className="text-gray-500">
              {match.university || 'University not specified'} • {' '}
              {match.degree || 'Degree not specified'}
            </p>
          </div>

          {/* Score */}
          <div className="text-center bg-blue-100 px-6 py-4 rounded-lg">
            <p className="text-4xl font-bold text-blue-600">{totalScore}</p>
            <p className="text-gray-600 text-sm">Match Score</p>
          </div>
        </div>

        {/* Score Breakdown */}
        {match.score_breakdown && (
          <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">University Match</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(match.score_breakdown.university || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Skills Match</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(match.score_breakdown.skills || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Interests Match</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(match.score_breakdown.interests || 0)}
              </p>
            </div>
          </div>
        )}

        {/* Common Skills */}
        {match.common_skills && match.common_skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Common Skills</h2>
            <div className="flex flex-wrap gap-2">
              {match.common_skills.map((skill, idx) => (
                <Badge key={idx} variant="success">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* About */}
        {match.bio && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">{match.bio}</p>
          </div>
        )}

        {/* Career/Education Info */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          {match.yearsOfExperience && (
            <div>
              <p className="text-gray-600 text-sm mb-1">Experience</p>
              <p className="text-lg font-semibold">
                {match.yearsOfExperience} years
              </p>
            </div>
          )}
          {match.industry && (
            <div>
              <p className="text-gray-600 text-sm mb-1">Industry</p>
              <p className="text-lg font-semibold">{match.industry}</p>
            </div>
          )}
          {match.currentYear && (
            <div>
              <p className="text-gray-600 text-sm mb-1">Current Year</p>
              <p className="text-lg font-semibold">Year {match.currentYear}</p>
            </div>
          )}
          {match.careerGoals && (
            <div>
              <p className="text-gray-600 text-sm mb-1">Career Goals</p>
              <p className="text-lg font-semibold">{match.careerGoals}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <Button
            onClick={handleStartChat}
            disabled={chatting}
            className="flex items-center gap-2 flex-1"
          >
            <FiMessageSquare size={20} />
            {chatting ? 'Starting Chat...' : 'Send Message'}
          </Button>
          <Button
            onClick={handleConnect}
            disabled={connecting}
            variant="outline"
            className="flex items-center gap-2 flex-1"
          >
            <FiUserPlus size={20} />
            {connecting ? 'Sending...' : 'Send Connection Request'}
          </Button>
        </div>
      </Card>

      {/* Detailed Skills Section */}
      {(match.skills || match.mentoringAreas || match.interests) && (
        <Card>
          <h2 className="text-xl font-bold mb-4">
            {user?.role === 'student' ? 'Mentoring Areas' : 'Skills'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {(match.skills || match.mentoringAreas || match.interests || []).map(
              (item, idx) => (
                <Badge key={idx} variant="primary">
                  {item}
                </Badge>
              )
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MatchDetails;