import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiEye, FiSearch, FiFilter, FiDownload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import CardShell from '../UserCategories/components/CardShell';
import Modal from '../UserCategories/components/Modal';

const Vendors = () => {
  const [vendors, setVendors] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      aadhar: '123456789012',
      pan: 'ABCDE1234F',
      service: 'AC Service',
      approvalStatus: 'pending',
      documents: {
        aadhar: 'https://via.placeholder.com/300x200',
        pan: 'https://via.placeholder.com/300x200',
        other: null
      },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543211',
      aadhar: '123456789013',
      pan: 'ABCDE1235F',
      service: 'Electrician',
      approvalStatus: 'approved',
      documents: {
        aadhar: 'https://via.placeholder.com/300x200',
        pan: 'https://via.placeholder.com/300x200',
        other: 'https://via.placeholder.com/300x200'
      },
      createdAt: '2024-01-10T14:20:00Z'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '9876543212',
      aadhar: '123456789014',
      pan: 'ABCDE1236F',
      service: 'Plumber',
      approvalStatus: 'rejected',
      documents: {
        aadhar: 'https://via.placeholder.com/300x200',
        pan: 'https://via.placeholder.com/300x200',
        other: null
      },
      createdAt: '2024-01-05T09:15:00Z'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesStatus = filterStatus === 'all' || vendor.approvalStatus === filterStatus;
      const matchesSearch = 
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.phone.includes(searchQuery) ||
        vendor.service.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [vendors, filterStatus, searchQuery]);

  const handleApprove = async (vendorId) => {
    // TODO: Replace with actual API call
    // await vendorService.approveVendor(vendorId);
    
    setVendors(prev => prev.map(v => 
      v.id === vendorId ? { ...v, approvalStatus: 'approved' } : v
    ));
    toast.success('Vendor approved successfully!');
  };

  const handleReject = async (vendorId) => {
    // TODO: Replace with actual API call
    // await vendorService.rejectVendor(vendorId);
    
    setVendors(prev => prev.map(v => 
      v.id === vendorId ? { ...v, approvalStatus: 'rejected' } : v
    ));
    toast.success('Vendor rejected.');
  };

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setIsViewModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const pendingCount = vendors.filter(v => v.approvalStatus === 'pending').length;
  const approvedCount = vendors.filter(v => v.approvalStatus === 'approved').length;
  const rejectedCount = vendors.filter(v => v.approvalStatus === 'rejected').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="lg:hidden">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Vendors</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage all vendor registrations</p>
      </div>

      <CardShell
        icon={FiFilter}
        title="Vendor Management"
        subtitle="Approve or reject vendor registrations"
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="text-sm font-medium text-yellow-700 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-900">{pendingCount}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="text-sm font-medium text-green-700 mb-1">Approved</div>
            <div className="text-2xl font-bold text-green-900">{approvedCount}</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="text-sm font-medium text-red-700 mb-1">Rejected</div>
            <div className="text-2xl font-bold text-red-900">{rejectedCount}</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <FiSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, phone, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filterStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filterStatus === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filterStatus === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No vendors found
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor, index) => (
                  <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{vendor.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{vendor.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{vendor.phone}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{vendor.service}</td>
                    <td className="px-4 py-4">{getStatusBadge(vendor.approvalStatus)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(vendor)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        {vendor.approvalStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(vendor.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(vendor.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardShell>

      {/* View Vendor Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedVendor(null);
        }}
        title="Vendor Details"
        size="lg"
      >
        {selectedVendor && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <div className="text-gray-900">{selectedVendor.name}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <div className="text-gray-900">{selectedVendor.email}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <div className="text-gray-900">{selectedVendor.phone}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Service</label>
                <div className="text-gray-900">{selectedVendor.service}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhar</label>
                <div className="text-gray-900">{selectedVendor.aadhar}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">PAN</label>
                <div className="text-gray-900">{selectedVendor.pan}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <div>{getStatusBadge(selectedVendor.approvalStatus)}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Registered</label>
                <div className="text-gray-900">
                  {new Date(selectedVendor.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Documents</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedVendor.documents.aadhar && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Aadhar Document</label>
                    <img
                      src={selectedVendor.documents.aadhar}
                      alt="Aadhar"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <a
                      href={selectedVendor.documents.aadhar}
                      download
                      className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <FiDownload className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                )}
                {selectedVendor.documents.pan && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">PAN Document</label>
                    <img
                      src={selectedVendor.documents.pan}
                      alt="PAN"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <a
                      href={selectedVendor.documents.pan}
                      download
                      className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <FiDownload className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                )}
                {selectedVendor.documents.other && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Other Document</label>
                    <img
                      src={selectedVendor.documents.other}
                      alt="Other"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <a
                      href={selectedVendor.documents.other}
                      download
                      className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <FiDownload className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                )}
              </div>
            </div>

            {selectedVendor.approvalStatus === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleApprove(selectedVendor.id);
                    setIsViewModalOpen(false);
                    setSelectedVendor(null);
                  }}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiCheck className="w-5 h-5" />
                  Approve Vendor
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedVendor.id);
                    setIsViewModalOpen(false);
                    setSelectedVendor(null);
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiX className="w-5 h-5" />
                  Reject Vendor
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Vendors;
