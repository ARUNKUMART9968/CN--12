import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loading = ({ fullScreen = false, message = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <ClipLoader color="#0066CC" size={50} />
          <p className="mt-4 text-gray-700 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <ClipLoader color="#0066CC" size={40} />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;