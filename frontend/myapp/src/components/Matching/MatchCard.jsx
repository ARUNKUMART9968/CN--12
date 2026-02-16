import React from 'react';
import { Card } from '../Common';

const MatchCard = ({ match, onClick }) => {
  return (
    <Card onClick={onClick} hover className="cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{match.alumni_name}</h3>
          <p className="text-gray-600 text-sm">{match.company}</p>
        </div>
        <div className="text-center bg-blue-100 px-2 py-1 rounded">
          <p className="font-bold text-blue-600 text-sm">{match.total_score}</p>
          <p className="text-xs text-gray-600">Score</p>
        </div>
      </div>

      {match.common_skills && match.common_skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {match.common_skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
};

export default MatchCard;