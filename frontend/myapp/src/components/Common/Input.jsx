import React from 'react';

const Input = ({
  label,
  error,
  icon: Icon,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-3.5 text-gray-400" size={20} />}
        <input
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;