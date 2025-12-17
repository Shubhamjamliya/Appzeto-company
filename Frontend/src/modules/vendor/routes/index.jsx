import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { autoInitDummyData } from '../utils/initDummyData';
// Import test helpers (makes window.initVendorData() available)
import '../utils/testDummyData';
import PageTransition from '../components/common/PageTransition';
import BottomNav from '../components/layout/BottomNav';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import PublicRoute from '../../../components/auth/PublicRoute';

// Lazy load vendor pages for code splitting with error handling
const lazyLoad = (importFunc) => {
  return lazy(() => {
    return Promise.resolve(importFunc()).catch((error) => {
      console.error('Failed to load vendor page:', error);
      // Return a fallback component wrapped in a Promise
      return Promise.resolve({
        default: () => (
          <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="text-center p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to load page</h2>
              <p className="text-gray-600 mb-4">Please refresh the page or try again later.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: '#00a6a6' }}
              >
                Refresh Page
              </button>
            </div>
          </div>
        ),
      });
    });
  });
};

const Login = lazyLoad(() => import('../pages/login'));
const Signup = lazyLoad(() => import('../pages/signup'));
const Dashboard = lazyLoad(() => import('../pages/Dashboard'));
const BookingAlert = lazyLoad(() => import('../pages/BookingAlert'));
const BookingDetails = lazyLoad(() => import('../pages/BookingDetails'));
const BookingTimeline = lazyLoad(() => import('../pages/BookingTimeline'));
const ActiveJobs = lazyLoad(() => import('../pages/ActiveJobs'));
const WorkersList = lazyLoad(() => import('../pages/WorkersList'));
const AddEditWorker = lazyLoad(() => import('../pages/AddEditWorker'));
const AssignWorker = lazyLoad(() => import('../pages/AssignWorker'));
const Earnings = lazyLoad(() => import('../pages/Earnings'));
const Wallet = lazyLoad(() => import('../pages/Wallet'));
const WithdrawalRequest = lazyLoad(() => import('../pages/WithdrawalRequest'));
const Profile = lazyLoad(() => import('../pages/Profile'));
const ProfileDetails = lazyLoad(() => import('../pages/Profile/ProfileDetails'));
const EditProfile = lazyLoad(() => import('../pages/Profile/EditProfile'));
const Settings = lazyLoad(() => import('../pages/Settings'));
const Notifications = lazyLoad(() => import('../pages/Notifications'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#00a6a6' }}></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

const VendorRoutes = () => {
  // Initialize dummy data when vendor routes load
  useEffect(() => {
    try {
      autoInitDummyData();
    } catch (error) {
      console.error('Failed to initialize vendor data:', error);
      // Try to initialize again after a delay
      setTimeout(() => {
        try {
          autoInitDummyData();
        } catch (retryError) {
          console.error('Retry failed to initialize vendor data:', retryError);
        }
      }, 500);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <PageTransition>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<PublicRoute userType="vendor"><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute userType="vendor"><Signup /></PublicRoute>} />
            
            {/* Protected routes (auth required) */}
            <Route path="/" element={<ProtectedRoute userType="vendor"><Navigate to="dashboard" replace /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute userType="vendor"><Dashboard /></ProtectedRoute>} />
            <Route path="/booking-alert/:id" element={<ProtectedRoute userType="vendor"><BookingAlert /></ProtectedRoute>} />
            <Route path="/booking/:id" element={<ProtectedRoute userType="vendor"><BookingDetails /></ProtectedRoute>} />
            <Route path="/booking/:id/timeline" element={<ProtectedRoute userType="vendor"><BookingTimeline /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute userType="vendor"><ActiveJobs /></ProtectedRoute>} />
            <Route path="/workers" element={<ProtectedRoute userType="vendor"><WorkersList /></ProtectedRoute>} />
            <Route path="/workers/add" element={<ProtectedRoute userType="vendor"><AddEditWorker /></ProtectedRoute>} />
            <Route path="/workers/:id/edit" element={<ProtectedRoute userType="vendor"><AddEditWorker /></ProtectedRoute>} />
            <Route path="/booking/:id/assign-worker" element={<ProtectedRoute userType="vendor"><AssignWorker /></ProtectedRoute>} />
            <Route path="/earnings" element={<ProtectedRoute userType="vendor"><Earnings /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute userType="vendor"><Wallet /></ProtectedRoute>} />
            <Route path="/wallet/withdraw" element={<ProtectedRoute userType="vendor"><WithdrawalRequest /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute userType="vendor"><Profile /></ProtectedRoute>} />
            <Route path="/profile/details" element={<ProtectedRoute userType="vendor"><ProfileDetails /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute userType="vendor"><EditProfile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute userType="vendor"><Settings /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute userType="vendor"><Notifications /></ProtectedRoute>} />
          </Routes>
        </PageTransition>
      </Suspense>
      <BottomNav />
    </ErrorBoundary>
  );
};

export default VendorRoutes;

