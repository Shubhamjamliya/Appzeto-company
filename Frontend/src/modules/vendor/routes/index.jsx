import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { autoInitDummyData } from '../utils/initDummyData';
// Import test helpers (makes window.initVendorData() available)
import '../utils/testDummyData';
import PageTransition from '../components/common/PageTransition';
import BottomNav from '../components/layout/BottomNav';

// Lazy load vendor pages for code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));
const BookingAlert = lazy(() => import('../pages/BookingAlert'));
const BookingDetails = lazy(() => import('../pages/BookingDetails'));
const BookingTimeline = lazy(() => import('../pages/BookingTimeline'));
const ActiveJobs = lazy(() => import('../pages/ActiveJobs'));
const WorkersList = lazy(() => import('../pages/WorkersList'));
const AddEditWorker = lazy(() => import('../pages/AddEditWorker'));
const AssignWorker = lazy(() => import('../pages/AssignWorker'));
const Earnings = lazy(() => import('../pages/Earnings'));
const Wallet = lazy(() => import('../pages/Wallet'));
const WithdrawalRequest = lazy(() => import('../pages/WithdrawalRequest'));
const Profile = lazy(() => import('../pages/Profile'));
const ProfileDetails = lazy(() => import('../pages/Profile/ProfileDetails'));
const EditProfile = lazy(() => import('../pages/Profile/EditProfile'));
const Settings = lazy(() => import('../pages/Settings'));
const Notifications = lazy(() => import('../pages/Notifications'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg, #FCD34D 0%, #FDE68A 50%, #FFFFFF 100%)' }}>
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#00a6a6' }}></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

const VendorRoutes = () => {
  // Initialize dummy data when vendor routes load
  useEffect(() => {
    autoInitDummyData();
  }, []);

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/booking-alert/:id" element={<BookingAlert />} />
            <Route path="/booking/:id" element={<BookingDetails />} />
            <Route path="/booking/:id/timeline" element={<BookingTimeline />} />
            <Route path="/jobs" element={<ActiveJobs />} />
            <Route path="/workers" element={<WorkersList />} />
            <Route path="/workers/add" element={<AddEditWorker />} />
            <Route path="/workers/:id/edit" element={<AddEditWorker />} />
            <Route path="/booking/:id/assign-worker" element={<AssignWorker />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/wallet/withdraw" element={<WithdrawalRequest />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/details" element={<ProfileDetails />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </PageTransition>
      </Suspense>
      <BottomNav />
    </>
  );
};

export default VendorRoutes;

