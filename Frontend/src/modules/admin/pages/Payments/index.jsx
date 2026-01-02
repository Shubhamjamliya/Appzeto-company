import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import PaymentOverview from './PaymentOverview';
import WorkerPayments from './WorkerPayments';
import VendorPayments from './VendorPayments';
import PaymentReports from './PaymentReports';

const Payments = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Overview', path: '/admin/payments/overview' },
    { id: 'workers', label: 'Worker Payments', path: '/admin/payments/workers' },
    { id: 'vendors', label: 'Vendor Payments', path: '/admin/payments/vendors' },
    { id: 'reports', label: 'Reports', path: '/admin/payments/reports' },
  ];

  const currentTab = tabs.find(tab => location.pathname.includes(tab.path))?.id || 'overview';

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${location.pathname.includes(tab.path)
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<PaymentOverview />} />
          <Route path="workers" element={<WorkerPayments />} />
          <Route path="vendors" element={<VendorPayments />} />
          <Route path="reports" element={<PaymentReports />} />
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Payments;