import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Navigate to={user?.role === 'student' ? '/student/dashboard' : '/alumni/dashboard'} />
  );
};

export default Home;