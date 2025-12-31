import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBriefcase, FiMapPin, FiClock, FiUser, FiFilter, FiSearch, FiLoader } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { vendorTheme as themeColors } from '../../../../theme';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

import { getBookings, assignWorker as assignWorkerApi } from '../../services/bookingService';
import { ConfirmDialog } from '../../components/common';

const ActiveJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, assigned, in_progress, completed
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    const bgStyle = themeColors.backgroundGradient;

    if (html) html.style.background = bgStyle;
    if (body) body.style.background = bgStyle;
    if (root) root.style.background = bgStyle;

    return () => {
      if (html) html.style.background = '';
      if (body) body.style.background = '';
      if (root) root.style.background = '';
    };
  }, []);

  useEffect(() => {


    const loadJobs = async () => {
      try {
        setLoading(true);
        const response = await getBookings();
        const jobsData = response.data || [];
        // Map API response to Component State structure
        const mappedJobs = jobsData.map(job => ({
          id: job._id || job.id,
          serviceType: job.serviceId?.title || job.serviceType || 'Service',
          user: {
            name: job.userId?.name || job.customerName || 'Customer'
          },
          location: {
            address: job.address?.addressLine1 || job.location?.address || 'Address not available'
          },
          price: (job.vendorEarnings || (job.finalAmount ? job.finalAmount * 0.9 : 0)).toFixed(2),
          status: job.status,
          assignedTo: job.workerId ? { name: job.workerId.name } : (job.assignedAt ? { name: 'You (Self)' } : null),
          timeSlot: {
            date: job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'Date',
            time: job.scheduledTime || 'Time'
          }
        }));
        setJobs(mappedJobs);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    // Load immediately and after a delay
    loadJobs();
    setTimeout(loadJobs, 200);

    window.addEventListener('vendorJobsUpdated', loadJobs);

    return () => {
      window.removeEventListener('vendorJobsUpdated', loadJobs);
    };
  }, []);

  const handleAssignToSelf = async (jobId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Assign to Self',
      message: 'Are you sure you want to do this job yourself?',
      onConfirm: async () => {
        try {
          const response = await assignWorkerApi(jobId, 'SELF');
          if (response && response.success) {
            toast.success("Assigned to yourself!");
            window.location.reload();
          }
        } catch (error) {
          console.error("Error assigning to self:", error);
          toast.error("Failed to assign to yourself");
        }
      }
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'ACCEPTED': '#F59E0B',
      'ASSIGNED': '#3B82F6',
      'VISITED': '#8B5CF6',
      'WORK_DONE': '#10B981',
      'WORKER_PAID': '#06B6D4',
      'SETTLEMENT_PENDING': '#F97316',
      'COMPLETED': '#059669',
    };
    return colors[status] || '#6B7280';
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' ||
      (filter === 'assigned' && job.status === 'ASSIGNED') ||
      (filter === 'in_progress' && ['VISITED', 'WORK_DONE'].includes(job.status)) ||
      (filter === 'completed' && job.status === 'COMPLETED');

    const matchesSearch = searchQuery === '' ||
      job.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.user?.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-20" style={{ background: themeColors.backgroundGradient }}>
      <Header title="Active Jobs" showSearch={true} />

      <main className="px-4 py-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{ focusRingColor: themeColors.button }}
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'all', label: 'All' },
            { id: 'assigned', label: 'Assigned' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${filter === filterOption.id
                ? 'text-white'
                : 'bg-white text-gray-700'
                }`}
              style={
                filter === filterOption.id
                  ? {
                    background: themeColors.button,
                    boxShadow: `0 2px 8px ${themeColors.button}40`,
                  }
                  : {
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }
              }
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
            <FiLoader className="w-12 h-12 text-teal-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div
            className="bg-white rounded-xl p-8 text-center shadow-md"
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <FiBriefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 font-semibold mb-2">No jobs found</p>
            <p className="text-sm text-gray-500">
              {searchQuery ? 'Try a different search term' : 'No active jobs at the moment'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map((job) => {
              const statusColor = getStatusColor(job.status);
              const hexToRgba = (hex, alpha) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
              };

              return (
                <div
                  key={job.id}
                  onClick={() => navigate(`/vendor/booking/${job.id}`)}
                  className="rounded-xl p-4 shadow-lg cursor-pointer active:scale-98 transition-all duration-200 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                    boxShadow: `0 8px 24px ${hexToRgba(statusColor, 0.15)}, 0 4px 12px ${hexToRgba(statusColor, 0.1)}, 0 0 0 2px ${hexToRgba(statusColor, 0.2)}`,
                    border: `2px solid ${hexToRgba(statusColor, 0.3)}`,
                  }}
                >
                  {/* Left border accent */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                    style={{
                      background: `linear-gradient(180deg, ${statusColor} 0%, ${statusColor}dd 100%)`,
                    }}
                  />

                  <div className="relative z-10 pl-2">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="p-1.5 rounded-lg"
                            style={{
                              background: `${statusColor}15`,
                            }}
                          >
                            <FiBriefcase className="w-4 h-4" style={{ color: statusColor }} />
                          </div>
                          <h3 className="font-bold text-gray-800 text-base">{job.serviceType}</h3>
                        </div>
                        <div className="ml-8 mb-2">
                          <span
                            className="text-xs font-bold px-3 py-1.5 rounded-full"
                            style={{
                              background: `linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%)`,
                              color: '#FFFFFF',
                              boxShadow: `0 2px 8px ${hexToRgba(statusColor, 0.3)}`,
                            }}
                          >
                            {job.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div
                        className="px-3 py-2 rounded-lg font-bold text-lg"
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.button}15 0%, ${themeColors.button}10 100%)`,
                          color: themeColors.button,
                          border: `1px solid ${hexToRgba(themeColors.button, 0.2)}`,
                        }}
                      >
                        ₹{job.price}
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1 rounded" style={{ background: 'rgba(0, 0, 0, 0.03)' }}>
                          <FiUser className="w-4 h-4" style={{ color: statusColor }} />
                        </div>
                        <span className="text-gray-700 font-medium">{job.user?.name || 'Customer'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1 rounded" style={{ background: 'rgba(0, 0, 0, 0.03)' }}>
                          <FiMapPin className="w-4 h-4" style={{ color: statusColor }} />
                        </div>
                        <span className="text-gray-700 font-medium truncate">{job.location?.address || 'Address not available'}</span>
                      </div>

                      {job.assignedTo && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1 rounded" style={{ background: 'rgba(0, 0, 0, 0.03)' }}>
                            <FiUser className="w-4 h-4" style={{ color: statusColor }} />
                          </div>
                          <span className="text-gray-700 font-medium">
                            Assigned to: <span className="font-semibold">{job.assignedTo === 'SELF' ? 'Yourself' : job.assignedTo.name}</span>
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1 rounded" style={{ background: 'rgba(0, 0, 0, 0.03)' }}>
                          <FiClock className="w-4 h-4" style={{ color: statusColor }} />
                        </div>
                        <span className="text-gray-700 font-medium">{job.timeSlot?.date} • {job.timeSlot?.time}</span>
                      </div>
                    </div>

                    {/* Quick Action Button for Unassigned Jobs */}
                    {['ACCEPTED', 'CONFIRMED'].includes(job.status?.toUpperCase()) && !job.assignedTo && (
                      <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignToSelf(job.id);
                          }}
                          className="flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          style={{
                            background: 'white',
                            color: themeColors.button,
                            border: `1.5px solid ${themeColors.button}`,
                          }}
                        >
                          <FiUser className="w-3.5 h-3.5" />
                          Do it Myself
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/vendor/booking/${job.id}/assign-worker`);
                          }}
                          className="flex-1 py-2 rounded-lg text-xs font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          style={{
                            background: themeColors.button,
                            boxShadow: `0 2px 8px ${themeColors.button}30`,
                          }}
                        >
                          <FiUser className="w-3.5 h-3.5" />
                          Assign Worker
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />

      <BottomNav />
    </div>
  );
};

export default ActiveJobs;

