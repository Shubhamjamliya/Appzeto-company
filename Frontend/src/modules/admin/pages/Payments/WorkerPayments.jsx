import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiFilter,
  FiUser,
  FiDollarSign,
  FiBriefcase,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { adminTransactionService } from '../../../../services/adminTransactionService';
import toast from 'react-hot-toast';

const WorkerPayments = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await adminTransactionService.getWorkerPaymentsSummary();
      if (response.success) {
        setWorkers(response.data);
      }
    } catch (error) {
      console.error('Error fetching worker payments:', error);
      toast.error('Failed to load worker payment data');
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkers = workers.filter(worker => 
    worker.name.toLowerCase().includes(search.toLowerCase()) ||
    worker.phone.includes(search) ||
    worker.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
            placeholder="Search workers..."
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
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Worker</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Wallet Balance</th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-sm">Loading workers...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    <p className="text-sm">No workers found with wallet balance</p>
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker) => (
                  <tr key={worker._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          <FiUser className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{worker.name}</div>
                          <div className="text-xs text-gray-500">{worker.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiBriefcase className="w-4 h-4 mr-2 text-gray-400" />
                        {worker.serviceCategory || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(worker.approvalStatus)}`}>
                        <span className="capitalize">{worker.approvalStatus}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-semibold ${worker.wallet?.balance > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                        {formatCurrency(worker.wallet?.balance)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkerPayments;