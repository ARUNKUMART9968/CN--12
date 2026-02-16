import React from 'react';
import { Card } from '../Common';

const MatchFilters = ({ onFilterChange }) => {
  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Filters</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Score</label>
          <input
            type="range"
            min="0"
            max="1000"
            onChange={(e) => onFilterChange('minScore', e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
          <select className="w-full px-3 py-2 border rounded-lg">
            <option>All Industries</option>
            <option>Technology</option>
            <option>Finance</option>
            <option>Consulting</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

export default MatchFilters;