import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load all pages for code splitting
const Home = lazy(() => import('../pages/Home'));
const Rewards = lazy(() => import('../pages/Rewards'));
const Account = lazy(() => import('../pages/Account'));
const Native = lazy(() => import('../pages/Native'));
const ACService = lazy(() => import('../pages/ACService'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const SalonForWomen = lazy(() => import('../pages/SalonForWomen'));
const MassageForMen = lazy(() => import('../pages/MassageForMen'));
const BathroomKitchenCleaning = lazy(() => import('../pages/BathroomKitchenCleaning'));
const SofaCarpetCleaning = lazy(() => import('../pages/SofaCarpetCleaning'));
const Electrician = lazy(() => import('../pages/Electrician'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg, #FCD34D 0%, #FDE68A 50%, #FFFFFF 100%)' }}>
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/account" element={<Account />} />
        <Route path="/native" element={<Native />} />
        <Route path="/ac-service" element={<ACService />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/salon-for-women" element={<SalonForWomen />} />
        <Route path="/massage-for-men" element={<MassageForMen />} />
        <Route path="/bathroom-kitchen-cleaning" element={<BathroomKitchenCleaning />} />
        <Route path="/sofa-carpet-cleaning" element={<SofaCarpetCleaning />} />
        <Route path="/electrician" element={<Electrician />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

