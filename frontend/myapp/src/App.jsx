import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Pages & Components
import { Login, Register, ProtectedRoute } from './components/Auth';
import { StudentDashboard, AlumniDashboard } from './components/Dashboard';
import { Navbar, Footer } from './components/Common';
import { StudentProfile, AlumniProfile, ProfileSetup, EditProfile } from './components/Profile';
import { JobsList, JobDetails, CreateJob, JobApplicants } from './components/Jobs';
import { Matches, MatchDetails } from './components/Matching';
import { Connections, PendingRequests } from './components/Connections';
import { ChatList, ChatWindow } from './components/Chat';
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

            {/* Profile Setup Route */}
            <Route
              path="/profile/create"
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile/edit"
              element={
                <ProtectedRoute requiredRole="student">
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/matches"
              element={
                <ProtectedRoute requiredRole="student">
                  <Matches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/match/:id"
              element={
                <ProtectedRoute requiredRole="student">
                  <MatchDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/connections"
              element={
                <ProtectedRoute requiredRole="student">
                  <Connections />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/connections/pending"
              element={
                <ProtectedRoute requiredRole="student">
                  <PendingRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/messages"
              element={
                <ProtectedRoute requiredRole="student">
                  <ChatList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/chat/:chatId"
              element={
                <ProtectedRoute requiredRole="student">
                  <ChatWindow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/jobs"
              element={
                <ProtectedRoute requiredRole="student">
                  <JobsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:jobId"
              element={
                <ProtectedRoute requiredRole="student">
                  <JobDetails />
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
            <Route
              path="/alumni/profile"
              element={
                <ProtectedRoute requiredRole="alumni">
                  <AlumniProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/profile/edit"
              element={
                <ProtectedRoute requiredRole="alumni">
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/connections"
              element={
                <ProtectedRoute requiredRole="alumni">
                  <Connections />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/messages"
              element={
                <ProtectedRoute requiredRole="alumni">
                  <ChatList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/chat/:chatId"
              element={
                <ProtectedRoute requiredRole="alumni">
                  <ChatWindow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/create-job"
              element={
                <ProtectedRoute requiredRole="alumni">
                  <CreateJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/jobs/:jobId/applicants"
              element={
                <ProtectedRoute requiredRole="alumni">
                  <JobApplicants />
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