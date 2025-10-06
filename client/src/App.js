import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateComplaint from './pages/CreateComplaint';
import ComplaintDetails from './pages/ComplaintDetails';
import EducationalVideos from './pages/EducationalVideos';
import Translation from './pages/Translation';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import Community from './pages/Community';
import VolunteerLogin from './pages/VolunteerLogin';
import VolunteerRegister from './pages/VolunteerRegister';
import VolunteerDashboard from './pages/VolunteerDashboard';
import CitizenVolunteerRegister from './pages/CitizenVolunteerRegister';
import AdminVolunteers from './pages/AdminVolunteers';
import AdminVolunteerTasks from './pages/AdminVolunteerTasks';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            <Route 
              path="/volunteer/login" 
              element={
                <PublicRoute>
                  <VolunteerLogin />
                </PublicRoute>
              } 
            />
            <Route 
              path="/volunteer/register" 
              element={
                <PublicRoute>
                  <VolunteerRegister />
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/complaints/create" 
              element={
                <ProtectedRoute>
                  <CreateComplaint />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/complaints/:id" 
              element={
                <ProtectedRoute>
                  <ComplaintDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/videos" 
              element={
                <ProtectedRoute>
                  <EducationalVideos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/translation" 
              element={
                <ProtectedRoute>
                  <Translation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community" 
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/volunteer/dashboard" 
              element={
                <ProtectedRoute>
                  <VolunteerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/citizen/volunteer/register" 
              element={
                <ProtectedRoute>
                  <CitizenVolunteerRegister />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/login" 
              element={
                <PublicRoute>
                  <AdminLogin />
                </PublicRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/volunteers" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminVolunteers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/volunteer-tasks" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminVolunteerTasks />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
