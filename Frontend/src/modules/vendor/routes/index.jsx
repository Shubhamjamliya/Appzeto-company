import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load vendor pages for code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

const VendorRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add more vendor routes here as pages are created */}
      </Routes>
    </Suspense>
  );
};

export default VendorRoutes;

