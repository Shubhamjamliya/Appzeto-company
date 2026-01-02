import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiFilter,
  FiUser,
  FiDollarSign,
  FiAlertTriangle,
  FiCheckCircle,
  FiBriefcase
} from 'react-icons/fi';
import { adminTransactionService } from '../../../../services/adminTransactionService';
import toast from 'react-hot-toast';

const VendorPayments = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [pagination.page, debouncedSearch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await adminTransactionService.getVendorBalances({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch
      });
      
      if (response.success) {
        setVendors(response.data);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            pages: response.pagination.pages
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching vendor balances:', error);
      toast.error('Failed to load vendor balance data');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={fetchData}
             className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
           >
             Refresh
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dues (Owed to Admin)</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Earnings</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-sm">Loading vendor balances...</p>
                    </div>
                  </td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    <p className="text-sm">No vendors found</p>
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                          <FiBriefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{vendor.businessName || vendor.name}</div>
                          <div className="text-xs text-gray-500">{vendor.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-semibold ${vendor.wallet?.dues > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                        {formatCurrency(vendor.wallet?.dues)}
                      </span>
                      {vendor.wallet?.dues > (vendor.wallet?.cashLimit || 10000) && (
                        <span className="ml-2 inline-flex items-center text-xs text-red-500" title="Exceeds Cash Limit">
                          <FiAlertTriangle />
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(vendor.wallet?.earnings)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {vendor.wallet?.isBlocked ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                        View Ledger
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && vendors.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="text-xs text-gray-500">
              Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VendorPayments;