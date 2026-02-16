import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Pages & Components
import { Login, Register, ProtectedRoute } from './components/Auth';
import { StudentDashboard, AlumniDashboard } from './components/Dashboard';
import { Navbar, Footer } from './components/Common';
import { Home, NotFound, Unauthorized } from './pages';

// Services
import authService from './services/auth';
import { updateUser } from './store/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Initialize app
  useEffect(() => {
    const token = authService.getToken();
    const savedUser = authService.getUser();

    if (token && savedUser) {
      dispatch(updateUser(savedUser));
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar - Show only when authenticated */}
        {isAuthenticated && <Navbar />}

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Alumni Routes */}
            <Route
              path="/alumni/dashboard"
              element={
                <ProtectedRoute requiredRole="alumni">
                  <AlumniDashboard />
                </ProtectedRoute>
              }
            />

            {/* Home/Redirect */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  user?.role === 'student' ? (
                    <Navigate to="/student/dashboard" />
                  ) : (
                    <Navigate to="/alumni/dashboard" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Error Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        {isAuthenticated && <Footer />}

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#000',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;