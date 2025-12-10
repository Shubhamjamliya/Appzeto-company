import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import module routes
import UserRoutes from '../modules/user/routes';
// import VendorRoutes from '../modules/vendor/routes';
// import AdminRoutes from '../modules/admin/routes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/*" element={<UserRoutes />} />

      {/* Vendor Routes - will be uncommented when ready */}
      {/* <Route path="/vendor/*" element={<VendorRoutes />} /> */}

      {/* Admin Routes - will be uncommented when ready */}
      {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}
    </Routes>
  );
};

export default AppRoutes;

