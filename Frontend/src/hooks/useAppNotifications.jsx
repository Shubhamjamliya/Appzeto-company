import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { playNotificationSound, isSoundEnabled, playAlertRing } from '../utils/notificationSound';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Universal hook for app-wide notifications
 * Connects to Socket.IO and listens for 'notification' and custom events
 */
export const useAppNotifications = (userType) => {
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let tokenKey = 'accessToken';
    switch (userType) {
      case 'vendor':
        tokenKey = 'vendorAccessToken';
        break;
      case 'worker':
        tokenKey = 'workerAccessToken';
        break;
      case 'admin':
        tokenKey = 'adminAccessToken';
        break;
      case 'user':
      default:
        tokenKey = 'accessToken';
        break;
    }

    const token = localStorage.getItem(tokenKey);
    // If no token, we don't connect
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log(`✅ ${userType.toUpperCase()} App Socket connected`);

      // If vendor, join vendor-specific room just in case backend expects it
      if (userType === 'vendor') {
        const vendorData = JSON.parse(localStorage.getItem('vendorData') || '{}');
        const vendorId = vendorData.id || vendorData._id;
        if (vendorId) {
          newSocket.emit('join_vendor_room', vendorId);
        }
      }
    });

    newSocket.on('disconnect', () => {
      console.log(`❌ ${userType.toUpperCase()} App Socket disconnected`);
    });

    newSocket.on('connect_error', (err) => {
      console.error(`Socket connection error (${userType}):`, err);
    });

    // Listen for generic notifications
    newSocket.on('notification', (data) => {
      console.log('🔔 App Notification received:', data);

      if (isSoundEnabled(userType)) {
        playNotificationSound();
      }

      // Show custom toast for all notifications
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 cursor-pointer`}
          onClick={() => {
            toast.dismiss(t.id);
            // Optional: navigate based on relatedId
            if (data.relatedId) {
              if (userType === 'vendor') navigate(`/vendor/booking/${data.relatedId}`);
              else if (userType === 'worker') navigate(`/worker/job/${data.relatedId}`);
              else navigate(`/user/booking/${data.relatedId}`);
            }
          }}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  🔔
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {data.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {data.message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'top-right'
      });

      // Dispatch update events to refresh UI components
      if (userType === 'worker') window.dispatchEvent(new Event('workerJobsUpdated'));
      if (userType === 'vendor') window.dispatchEvent(new Event('vendorJobsUpdated'));
    });

    // Listen for special Vendor Booking Requests
    if (userType === 'vendor') {
      newSocket.on('new_booking_request', (data) => {
        console.log('🚨 New Booking Request Alert:', data);

        // Play urgent alert ring
        playAlertRing();

        // Save to localStorage for the Alert screen and Dashboard to read
        const newJob = {
          id: data.bookingId,
          serviceType: data.serviceName,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          location: {
            address: 'Location shared',
            distance: data.distance ? `${data.distance.toFixed(1)} km` : 'Near you'
          },
          price: data.price,
          timeSlot: {
            date: new Date(data.scheduledDate).toLocaleDateString(),
            time: data.scheduledTime
          },
          status: 'REQUESTED',
          createdAt: new Date().toISOString()
        };

        const pendingJobs = JSON.parse(localStorage.getItem('vendorPendingJobs') || '[]');
        if (!pendingJobs.find(job => job.id === newJob.id)) {
          pendingJobs.unshift(newJob);
          localStorage.setItem('vendorPendingJobs', JSON.stringify(pendingJobs));

          // Update stats
          const stats = JSON.parse(localStorage.getItem('vendorStats') || '{}');
          stats.pendingAlerts = (stats.pendingAlerts || 0) + 1;
          localStorage.setItem('vendorStats', JSON.stringify(stats));
        }

        // Notify app components to refresh
        window.dispatchEvent(new Event('vendorJobsUpdated'));
        window.dispatchEvent(new Event('vendorStatsUpdated'));

        // Navigate to Alert Page
        navigate(`/vendor/booking-alert/${data.bookingId}`);
      });
    }

    return () => {
      newSocket.disconnect();
    };

  }, [userType, navigate]);

  return socket;
};

export default useAppNotifications;

