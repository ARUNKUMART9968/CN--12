import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <FiAlertCircle className="mx-auto mb-4 text-red-600" size={64} />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;