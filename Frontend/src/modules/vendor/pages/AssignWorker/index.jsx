import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUser, FiCheck, FiArrowRight } from 'react-icons/fi';
import { vendorTheme as themeColors } from '../../../../theme';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

const AssignWorker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [assignToSelf, setAssignToSelf] = useState(false);

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
    // Load booking
    const loadBooking = () => {
      try {
        const acceptedBookings = JSON.parse(localStorage.getItem('vendorAcceptedBookings') || '[]');
        const found = acceptedBookings.find(b => b.id === id);
        if (found) {
          setBooking(found);
        }
      } catch (error) {
        console.error('Error loading booking:', error);
      }
    };

    // Load workers
    const loadWorkers = () => {
      try {
        const savedWorkers = JSON.parse(localStorage.getItem('vendorWorkers') || '[]');
        // Filter available workers (online and not assigned to another job)
        const available = savedWorkers.filter(w => 
          w.availability === 'ONLINE' && !w.currentJob
        );
        setWorkers(available);
      } catch (error) {
        console.error('Error loading workers:', error);
      }
    };

    loadBooking();
    loadWorkers();
  }, [id]);

  const handleAssign = () => {
    if (!assignToSelf && !selectedWorker) {
      alert('Please select a worker or assign to yourself');
      return;
    }

    try {
      const acceptedBookings = JSON.parse(localStorage.getItem('vendorAcceptedBookings') || '[]');
      const updated = acceptedBookings.map(b => {
        if (b.id === id) {
          return {
            ...b,
            status: 'ASSIGNED',
            assignedTo: assignToSelf ? 'SELF' : { id: selectedWorker.id, name: selectedWorker.name },
            timeline: [...(b.timeline || []), { stage: 3, timestamp: new Date().toISOString() }],
          };
        }
        return b;
      });
      localStorage.setItem('vendorAcceptedBookings', JSON.stringify(updated));

      // Update worker's current job if assigned to worker
      if (!assignToSelf && selectedWorker) {
        const savedWorkers = JSON.parse(localStorage.getItem('vendorWorkers') || '[]');
        const updatedWorkers = savedWorkers.map(w => 
          w.id === selectedWorker.id ? { ...w, currentJob: id } : w
        );
        localStorage.setItem('vendorWorkers', JSON.stringify(updatedWorkers));
        window.dispatchEvent(new Event('vendorWorkersUpdated'));
      }

      window.dispatchEvent(new Event('vendorJobsUpdated'));
      navigate(`/vendor/booking/${id}`);
    } catch (error) {
      console.error('Error assigning worker:', error);
      alert('Failed to assign worker. Please try again.');
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: themeColors.backgroundGradient }}>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: themeColors.backgroundGradient }}>
      <Header title="Assign Worker" />

      <main className="px-4 py-6">
        {/* Booking Summary */}
        <div
          className="bg-white rounded-xl p-4 mb-6 shadow-md"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 className="font-bold text-gray-800 mb-2">{booking.serviceType}</h3>
          <p className="text-sm text-gray-600">{booking.location?.address}</p>
          <p className="text-sm font-semibold mt-2" style={{ color: themeColors.button }}>
            ₹{booking.price}
          </p>
        </div>

        {/* Self Assignment Option */}
        <div className="mb-6">
          <button
            onClick={() => {
              setAssignToSelf(true);
              setSelectedWorker(null);
            }}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              assignToSelf
                ? 'border-2'
                : 'bg-white border border-gray-200'
            }`}
            style={
              assignToSelf
                ? {
                    borderColor: themeColors.button,
                    background: `${themeColors.button}10`,
                  }
                : {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }
            }
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  assignToSelf ? 'bg-white' : 'bg-gray-100'
                }`}
                style={
                  assignToSelf
                    ? {
                        border: `3px solid ${themeColors.button}`,
                      }
                    : {}
                }
              >
                {assignToSelf ? (
                  <FiCheck className="w-6 h-6" style={{ color: themeColors.button }} />
                ) : (
                  <FiUser className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">I'll do this job myself</h3>
                <p className="text-sm text-gray-600">Assign the booking to yourself</p>
              </div>
            </div>
          </button>
        </div>

        {/* Available Workers */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4">Available Workers</h3>
          {workers.length === 0 ? (
            <div
              className="bg-white rounded-xl p-6 text-center shadow-md"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <FiUser className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-600 mb-2">No available workers</p>
              <p className="text-sm text-gray-500 mb-4">All workers are currently assigned or offline</p>
              <button
                onClick={() => navigate('/vendor/workers/add')}
                className="px-4 py-2 rounded-lg font-semibold text-white text-sm"
                style={{
                  background: themeColors.button,
                  boxShadow: `0 2px 8px ${themeColors.button}40`,
                }}
              >
                Add Worker
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {workers.map((worker) => (
                <button
                  key={worker.id}
                  onClick={() => {
                    setSelectedWorker(worker);
                    setAssignToSelf(false);
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    selectedWorker?.id === worker.id
                      ? 'border-2'
                      : 'bg-white border border-gray-200'
                  }`}
                  style={
                    selectedWorker?.id === worker.id
                      ? {
                          borderColor: themeColors.button,
                          background: `${themeColors.button}10`,
                        }
                      : {
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        }
                  }
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedWorker?.id === worker.id ? 'bg-white' : 'bg-gray-100'
                      }`}
                      style={
                        selectedWorker?.id === worker.id
                          ? {
                              border: `3px solid ${themeColors.button}`,
                            }
                          : {}
                      }
                    >
                      {selectedWorker?.id === worker.id ? (
                        <FiCheck className="w-6 h-6" style={{ color: themeColors.button }} />
                      ) : (
                        <FiUser className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{worker.name}</h3>
                      <p className="text-sm text-gray-600">{worker.phone}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {worker.skills?.slice(0, 2).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-lg text-xs font-medium"
                            style={{
                              background: `${themeColors.button}15`,
                              color: themeColors.button,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                        {worker.skills?.length > 2 && (
                          <span className="text-xs text-gray-500">+{worker.skills.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Assign Button */}
        <div className="mt-8">
          <button
            onClick={handleAssign}
            disabled={!assignToSelf && !selectedWorker}
            className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: themeColors.button,
              boxShadow: `0 4px 12px ${themeColors.button}40`,
            }}
          >
            Assign
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AssignWorker;

