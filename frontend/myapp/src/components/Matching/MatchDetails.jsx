import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Loading, Button } from '../Common';
import matchingService from '../../services/matching';
import toast from 'react-hot-toast';

const MatchDetails = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await matchingService.getMatchDetails(id, id);
        setMatch(response.data);
      } catch (error) {
        toast.error('Failed to load match details');
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  if (loading) return <Loading fullScreen />;
  if (!match) return <div>Match not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      <Card className="mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Match Details</h1>
            <p className="text-gray-600">Compatibility Score: {match.total_score}</p>
          </div>
          <Button>Send Connection Request</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y">
          <div>
            <p className="text-gray-600 text-sm">University Match</p>
            <p className="text-2xl font-bold text-blue-600">{match.score_breakdown?.university || 0}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Skills Match</p>
            <p className="text-2xl font-bold text-green-600">{match.score_breakdown?.skills || 0}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Interests Match</p>
            <p className="text-2xl font-bold text-purple-600">{match.score_breakdown?.interests || 0}</p>
          </div>
        </div>

        {match.common_skills && match.common_skills.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Common Skills</h2>
            <div className="flex flex-wrap gap-2">
              {match.common_skills.map((skill, idx) => (
                <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MatchDetails;