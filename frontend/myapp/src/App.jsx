// src/App.jsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeSocket, closeSocket } from './api/socket';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Import pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

function App() {
  const token = useSelector((state) => state.auth?.token);

  useEffect(() => {
    if (token) {
      // Initialize socket when user is logged in
      initializeSocket(token);
    }

    return () => {
      // Cleanup socket on logout or unmount
      if (!token) {
        closeSocket();
      }
    };
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;