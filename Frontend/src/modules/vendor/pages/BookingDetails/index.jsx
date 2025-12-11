import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiMapPin, FiClock, FiDollarSign, FiUser, FiPhone, FiNavigation, FiArrowRight } from 'react-icons/fi';
import { vendorTheme as themeColors } from '../../../../theme';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

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
    // Load booking from localStorage (mock data)
    const loadBooking = () => {
      try {
        const acceptedBookings = JSON.parse(localStorage.getItem('vendorAcceptedBookings') || '[]');
        const found = acceptedBookings.find(b => b.id === id) || {
          id: id || '1',
          serviceType: 'Fan Repairing',
          user: {
            name: 'John Doe',
            phone: '+91 9876543210',
          },
          location: {
            address: '123 Main Street, Indore, Madhya Pradesh 452001',
            lat: 22.7196,
            lng: 75.8577,
            distance: '2.5 km',
          },
          price: 500,
          timeSlot: {
            date: 'Today',
            time: '2:00 PM - 4:00 PM',
          },
          status: 'ACCEPTED',
          description: 'Fan is not working properly, needs repair',
        };
        setBooking(found);
      } catch (error) {
        console.error('Error loading booking:', error);
      }
    };

    loadBooking();
  }, [id]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: themeColors.backgroundGradient }}>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const handleCallUser = () => {
    window.location.href = `tel:${booking.user.phone}`;
  };

  const handleViewTimeline = () => {
    navigate(`/vendor/booking/${booking.id}/timeline`);
  };

  const handleAssignWorker = () => {
    navigate(`/vendor/booking/${booking.id}/assign-worker`);
  };

  const handleStartJourney = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.location.lat},${booking.location.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: themeColors.backgroundGradient }}>
      <Header title="Booking Details" />

      <main className="px-4 py-6">
        {/* Service Type Card */}
        <div
          className="bg-white rounded-xl p-4 mb-4 shadow-md"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Service Type</p>
              <p className="text-xl font-bold" style={{ color: themeColors.button }}>
                {booking.serviceType}
              </p>
            </div>
            <div
              className="px-3 py-1 rounded-full text-sm font-semibold"
              style={{
                background: `${themeColors.button}15`,
                color: themeColors.button,
              }}
            >
              {booking.status}
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div
          className="bg-white rounded-xl p-4 mb-4 shadow-md"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${themeColors.icon}15` }}
              >
                <FiUser className="w-6 h-6" style={{ color: themeColors.icon }} />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{booking.user.name}</p>
                <p className="text-sm text-gray-600">{booking.user.phone}</p>
              </div>
            </div>
            <button
              onClick={handleCallUser}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              style={{ backgroundColor: `${themeColors.button}15` }}
            >
              <FiPhone className="w-5 h-5" style={{ color: themeColors.button }} />
            </button>
          </div>
        </div>

        {/* Address Card with Map */}
        <div
          className="bg-white rounded-xl p-4 mb-4 shadow-md"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex items-start gap-3 mb-3">
            <FiMapPin className="w-5 h-5 mt-0.5" style={{ color: themeColors.icon }} />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <p className="font-semibold text-gray-800">{booking.location.address}</p>
              <p className="text-sm text-gray-500 mt-1">{booking.location.distance} away</p>
            </div>
          </div>
          
          {/* Map Embed */}
          <div className="w-full h-48 rounded-lg overflow-hidden mb-3 bg-gray-200">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6d_s6L4c0ZO0xU0&q=${booking.location.lat},${booking.location.lng}`}
              allowFullScreen
            ></iframe>
          </div>

          <button
            onClick={handleStartJourney}
            className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: themeColors.button,
              boxShadow: `0 4px 12px ${themeColors.button}40`,
            }}
          >
            <FiNavigation className="w-5 h-5" />
            Start Journey
          </button>
        </div>

        {/* Service Description */}
        {booking.description && (
          <div
            className="bg-white rounded-xl p-4 mb-4 shadow-md"
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <p className="text-sm text-gray-600 mb-2">Service Description</p>
            <p className="text-gray-800">{booking.description}</p>
          </div>
        )}

        {/* Time Slot */}
        <div
          className="bg-white rounded-xl p-4 mb-4 shadow-md"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <FiClock className="w-5 h-5" style={{ color: themeColors.icon }} />
            <div>
              <p className="text-sm text-gray-600">Preferred Time</p>
              <p className="font-semibold text-gray-800">{booking.timeSlot.date}</p>
              <p className="text-sm text-gray-600">{booking.timeSlot.time}</p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div
          className="bg-white rounded-xl p-4 mb-4 shadow-md"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiDollarSign className="w-5 h-5" style={{ color: themeColors.icon }} />
              <div>
                <p className="text-sm text-gray-600">Estimated Price</p>
                <p className="text-2xl font-bold" style={{ color: themeColors.button }}>
                  ₹{booking.price}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleViewTimeline}
            className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: themeColors.button,
              boxShadow: `0 4px 12px ${themeColors.button}40`,
            }}
          >
            View Timeline
            <FiArrowRight className="w-5 h-5" />
          </button>

          {booking.status === 'ACCEPTED' && (
            <button
              onClick={handleAssignWorker}
              className="w-full py-4 rounded-xl font-semibold border-2 transition-all active:scale-95"
              style={{
                borderColor: themeColors.button,
                color: themeColors.button,
                background: 'white',
              }}
            >
              Assign Worker
            </button>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default BookingDetails;

