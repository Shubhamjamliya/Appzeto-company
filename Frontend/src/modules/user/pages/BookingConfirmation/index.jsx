import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { themeColors } from '../../../../theme';
import {
  FiCheckCircle,
  FiMapPin,
  FiClock,
  FiCalendar,
  FiPackage,
  FiDollarSign,
  FiHome,
  FiArrowRight,
  FiLoader
} from 'react-icons/fi';
import { bookingService } from '../../../../services/bookingService';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getById(id);
        if (response.success) {
          setBooking(response.data);
        } else {
          toast.error(response.message || 'Booking not found');
          navigate('/user/my-bookings');
        }
      } catch (error) {
        toast.error('Failed to load booking details');
        navigate('/user/my-bookings');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBooking();
    }
  }, [id, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getAddressString = (address) => {
    if (typeof address === 'string') return address;
    if (address && typeof address === 'object') {
      return `${address.addressLine1 || ''}${address.addressLine2 ? `, ${address.addressLine2}` : ''}, ${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}`;
    }
    return 'N/A';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Booking not found</p>
          <button
            onClick={() => navigate('/user/my-bookings')}
            className="mt-4 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: themeColors.button }}
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const handleViewDetails = () => {
    navigate(`/user/booking/${booking._id || booking.id}`);
  };

  const handleGoHome = () => {
    navigate('/user', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="px-4 py-6">
        {/* Success Icon */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <FiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Booking Confirmed!</h1>
          <p className="text-sm text-gray-600 text-center">
            Your booking has been confirmed. We'll send you updates via SMS.
          </p>
        </div>

        {/* Booking ID Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Booking ID</p>
              <p className="text-base font-bold text-black">{booking.bookingNumber || booking._id || booking.id}</p>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              <span className="text-sm font-semibold">Confirmed</span>
            </div>
          </div>
        </div>

        {/* Service Details Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 mb-4">
          <h3 className="text-base font-bold text-black mb-3">Service Details</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0, 166, 166, 0.1)' }}>
                <FiMapPin className="w-4 h-4" style={{ color: themeColors.button }} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Service Address</p>
                <p className="text-sm text-gray-700">{getAddressString(booking.address)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0, 166, 166, 0.1)' }}>
                <FiCalendar className="w-4 h-4" style={{ color: themeColors.button }} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                <p className="text-sm text-gray-700">
                  {formatDate(booking.scheduledDate)} • {booking.scheduledTime || booking.timeSlot?.start || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Summary Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 mb-4">
          <h3 className="text-base font-bold text-black mb-3">Service Booked</h3>
          <div className="space-y-3">
            {/* Main Service */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0, 166, 166, 0.1)' }}>
                <FiPackage className="w-5 h-5" style={{ color: themeColors.button }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-black">{booking.serviceName || 'Service'}</p>
                <p className="text-xs text-gray-500">{booking.serviceCategory || 'General'}</p>
              </div>
            </div>

            {/* Booked Items - from bookedItems array (new structure with section + card) */}
            {booking.bookedItems && booking.bookedItems.length > 0 ? (
              <div className="space-y-3">
                {booking.bookedItems.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    {/* Section Title */}
                    {item.sectionTitle && (
                      <p className="text-xs text-gray-500 font-medium mb-2">{item.sectionTitle}</p>
                    )}
                    {/* Card Details */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{item.card?.title || item.title}</p>
                        {item.card?.subtitle && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.card.subtitle}</p>
                        )}
                        {item.card?.duration && (
                          <p className="text-xs text-gray-400 mt-1">⏱ {item.card.duration}</p>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-800 ml-3">₹{(item.card?.price || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : booking.userNotes ? (
              <div className="bg-gray-50 rounded-lg p-3 mt-2">
                <p className="text-xs text-gray-500 mb-1">Specific Service</p>
                <p className="text-sm font-medium text-gray-800">
                  {booking.userNotes.replace('Items: ', '')}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 mb-6 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: themeColors.gradient || themeColors.button }}></div>
          <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <FiDollarSign className="w-5 h-5" style={{ color: themeColors.button }} />
            Payment Summary
          </h3>

          {/* Check if booking is covered by plan (free) */}
          {(booking.paymentMethod === 'plan_benefit' || (booking.finalAmount === 0 && !booking.paymentId)) ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-800">Covered by Your Plan!</p>
                  <p className="text-xs text-green-600">No payment required</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-green-200">
                <span className="text-sm text-green-700">Amount Saved</span>
                <span className="text-lg font-bold text-green-700">₹{(booking.basePrice || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Base Price</span>
                <span className="text-sm font-medium text-slate-900">₹{(booking.basePrice || 0).toLocaleString('en-IN')}</span>
              </div>
              {booking.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600 font-medium">Discount</span>
                  <span className="text-sm font-medium text-green-600">-₹{booking.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {booking.tax > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">GST (18%)</span>
                  <span className="text-sm font-medium text-slate-700">₹{booking.tax.toLocaleString('en-IN')}</span>
                </div>
              )}
              {(booking.visitingCharges > 0 || booking.visitationFee > 0) && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Convenience Fee</span>
                  <span className="text-sm font-medium text-slate-700">₹{(booking.visitingCharges || booking.visitationFee).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900">Total Paid</span>
                  <span className="text-xl font-black text-slate-900">₹{(booking.finalAmount || booking.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Success Badge */}
          {booking.paymentId && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                <FiCheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-green-700">Payment Successful</p>
                  <p className="text-xs text-green-600">ID: {booking.paymentId}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleViewDetails}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-base font-semibold text-white transition-all"
            style={{ backgroundColor: themeColors.button }}
            onMouseEnter={(e) => e.target.style.backgroundColor = themeColors.button}
            onMouseLeave={(e) => e.target.style.backgroundColor = themeColors.button}
          >
            View Full Details
            <FiArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={handleGoHome}
            className="w-full py-3 rounded-lg text-base font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation;

