import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { themeColors } from '../../../../theme';
import {
  FiArrowLeft,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiCalendar,
  FiDollarSign,
  FiPackage,
  FiEdit2,
  FiPhone,
  FiMail,
  FiHome,
  FiKey,
  FiStar,
  FiAward
} from 'react-icons/fi';
import { bookingService } from '../../../../services/bookingService';
import { paymentService } from '../../../../services/paymentService';
import { cartService } from '../../../../services/cartService';
import RatingModal from '../../components/booking/RatingModal';
import PaymentVerificationModal from '../../components/booking/PaymentVerificationModal';
import { ConfirmDialog } from '../../../../components/common';


const BookingDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  // Function to load booking
  const loadBooking = async () => {
    try {
      // Don't set loading true on refresh to avoid flicker
      const response = await bookingService.getById(id);
      if (response.success) {
        setBooking(response.data);
      } else {
        toast.error(response.message || 'Booking not found');
        navigate('/user/my-bookings');
      }
    } catch (error) {
      console.error('Failed to load booking details', error);
      // toast.error('Failed to load booking details'); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadBooking();
    }
  }, [id, navigate]);

  // Auto-show rating modal ONLY when booking is fully completed (after payment)
  useEffect(() => {
    if (booking && (booking.status === 'completed' || booking.status === 'COMPLETED') && !booking.rating && !showRatingModal) {
      const dismissed = localStorage.getItem(`rating_dismissed_${id}`);
      if (!dismissed) {
        setShowRatingModal(true);
      }
    }
  }, [booking, id]);

  // Handle Payment Modal Visibility
  useEffect(() => {
    if (booking && booking.customerConfirmationOTP && !booking.cashCollected) {
      setShowPaymentModal(true);
    } else {
      setShowPaymentModal(false);
    }
  }, [booking]);

  // Socket Listener for Real-time Updates
  useEffect(() => {
    const socketUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace('/api', '');
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?._id || userData?.id) {
      const userId = userData._id || userData.id;
      socket.emit('join', `user_${userId}`);

      // Listen for generic notifications
      socket.on('notification', (data) => {
        if (data && (data.relatedId === id || data.data?.bookingId === id)) {
          loadBooking();
          toast(data.message || 'Booking updated', { icon: '🔔' });
        }
      });

      // Listen for specific booking updates if any
      socket.on('booking_updated', (data) => {
        if (data.bookingId === id) loadBooking();
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
      case 'journey_started':
        return <FiLoader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <FiCheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      case 'awaiting_payment':
      case 'work_done':
        return <FiClock className="w-5 h-5 text-orange-500" />;
      default:
        return <FiClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress':
      case 'journey_started':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'awaiting_payment':
      case 'work_done':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'journey_started': return 'Agent En Route';
      case 'visited': return 'Agent Arrived';
      case 'in_progress': return 'In Progress';
      case 'work_done': return 'Work Done'; // Payment Pending
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'awaiting_payment': return 'Request Accepted';
      default: return status?.replace('_', ' ') || 'Pending';
    }
  };

  // ... (keep handle methods same) ...

  const handleCancelBooking = async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Cancel Booking',
      message: 'Are you sure you want to cancel this booking? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        try {
          const response = await bookingService.cancel(booking._id || booking.id, 'Cancelled by user');
          if (response.success) {
            toast.success('Booking cancelled successfully');
            loadBooking();
          } else {
            toast.error(response.message || 'Failed to cancel booking');
          }
        } catch (error) {
          toast.error('Failed to cancel booking. Please try again.');
        }
      }
    });
  };

  const handleOnlinePayment = async () => {
    try {
      toast.loading('Creating payment order...');
      const orderResponse = await paymentService.createOrder(booking._id || booking.id);
      toast.dismiss();

      if (!orderResponse.success) {
        toast.error(orderResponse.message || 'Failed to create payment order');
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount * 100,
        currency: orderResponse.data.currency || 'INR',
        order_id: orderResponse.data.orderId,
        name: 'Appzeto',
        description: `Payment for ${booking.serviceName}`,
        handler: async function (response) {
          toast.loading('Verifying payment...');
          const verifyResponse = await paymentService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          toast.dismiss();

          if (verifyResponse.success) {
            toast.success('Payment successful!');
            loadBooking();
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'User',
          contact: ''
        },
        theme: {
          color: themeColors.button
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to process payment');
    }
  };

  const handlePayAtHome = async () => {
    try {
      toast.loading('Confirming request...');
      const response = await paymentService.confirmPayAtHome(booking._id || booking.id);
      toast.dismiss();

      if (response.success) {
        toast.success('Booking confirmed!');
        loadBooking();
      } else {
        toast.error(response.message || 'Failed to confirm booking');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to process request');
    }
  };


  const handleRateSubmit = async (ratingData) => {
    try {
      const response = await bookingService.addReview(booking._id || booking.id, ratingData);
      if (response.success) {
        toast.success('Thank you for your feedback!');
        setShowRatingModal(false);
        loadBooking();
      } else {
        toast.error(response.message || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('Failed to submit review');
    }
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
            className="mt-4 px-4 py-2 bg-brand text-white rounded-lg"
            style={{ backgroundColor: themeColors.button }}
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 pb-64">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-black" />
            </button>
            <h1 className="text-xl font-bold text-black">Booking Details</h1>
          </div>
        </div>
      </header>

      {/* Unified Payment Notification Section is now handled by the PaymentVerificationModal */}
      {/* If modal is closed, show a subtle reminder in the summary card instead of fixed banners */}

      <main className="px-4 py-4 space-y-4">
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-black mb-1">
                {booking.serviceName || booking.serviceCategory || 'Service'}
              </h2>
              <p className="text-xs text-gray-500">Booking ID: {booking.bookingNumber || booking._id || booking.id}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              {getStatusLabel(booking.status)}
            </div>
          </div>
        </div>

        {/* Address & Track Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <h3 className="text-base font-bold text-black mb-3">Service Location & Tracking</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0, 166, 166, 0.1)' }}>
                <FiMapPin className="w-4 h-4" style={{ color: themeColors.button }} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-sm text-gray-700">{getAddressString(booking.address)}</p>
              </div>
            </div>

            {/* Map Preview Logic - Same as Worker App */}
            {booking.address && (
              <div
                className="w-full h-40 rounded-lg overflow-hidden bg-gray-200 border border-gray-100 relative group cursor-pointer"
                onClick={() => navigate(`/user/booking/${booking._id || booking.id}/track`)}
              >
                {(() => {
                  let mapQuery = '';
                  if (typeof booking.address === 'object' && booking.address.lat && booking.address.lng) {
                    mapQuery = `${booking.address.lat},${booking.address.lng}`;
                  } else {
                    const addrStr = typeof booking.address === 'string'
                      ? booking.address
                      : `${booking.address?.addressLine1 || ''}, ${booking.address?.city || ''}`;
                    mapQuery = encodeURIComponent(addrStr);
                  }

                  return (
                    <>
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0, pointerEvents: 'none' }}
                        src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                        allowFullScreen
                        tabIndex="-1"
                        title="Location Map"
                      ></iframe>
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors flex items-center justify-center">
                        <span className="bg-white/90 px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                          <FiMapPin className="w-3 h-3" /> Track Order
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Track Button */}
            <button
              onClick={() => navigate(`/user/booking/${booking._id || booking.id}/track`)}
              className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md"
              style={{ background: themeColors.button }}
            >
              <FiMapPin className="w-4 h-4" />
              Track Service Agent
            </button>

            <div className="flex items-start gap-3 pt-2">
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

        {/* Service Details Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <h3 className="text-base font-bold text-black mb-3">Service Booked</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0, 166, 166, 0.1)' }}>
                <FiPackage className="w-5 h-5" style={{ color: themeColors.button }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-black">{booking.serviceName || 'Service'}</p>
                <p className="text-xs text-gray-500">{booking.serviceCategory || 'General'}</p>
                {booking.description && (
                  <p className="text-xs text-gray-600 mt-1">{booking.description}</p>
                )}
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
                        {(item.card?.subtitle || item.card?.description) && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.card?.subtitle || item.card?.description}</p>
                        )}
                        {item.card?.duration && (
                          <p className="text-xs text-gray-400 mt-1">⏱ {item.card.duration}</p>
                        )}
                        {item.card?.features && item.card.features.length > 0 && (
                          <div className="mt-2">
                            {item.card.features.slice(0, 2).map((f, i) => (
                              <p key={i} className="text-xs text-gray-500">• {f}</p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-3">
                        <p className="text-sm font-bold text-gray-800">₹{(item.card?.price || 0).toLocaleString('en-IN')}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-500">x{item.quantity}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : booking.userNotes ? (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Specific Service Requested</p>
                <p className="text-sm font-medium text-gray-800">
                  {booking.userNotes.replace('Items: ', '')}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <h3 className="text-base font-bold text-black mb-3">Payment Summary</h3>

          {/* Plan Benefit - Free Booking */}
          {booking.paymentMethod === 'plan_benefit' ? (
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
                <span className="text-sm text-green-700">Service Value</span>
                <span className="text-lg font-bold text-green-700">₹{(booking.basePrice || 0).toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-green-600 mt-2">You saved ₹{(booking.basePrice || 0).toLocaleString('en-IN')} with your subscription!</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base Price</span>
                <span className="text-sm font-semibold text-black">₹{(booking.basePrice || 0).toLocaleString('en-IN')}</span>
              </div>
              {booking.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Discount</span>
                  <span className="text-sm font-semibold text-green-600">-₹{booking.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {booking.tax > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">GST (18%)</span>
                  <span className="text-sm font-semibold text-black">₹{booking.tax.toLocaleString('en-IN')}</span>
                </div>
              )}
              {(booking.visitationFee > 0 || booking.visitingCharges > 0) && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Convenience Fee</span>
                  <span className="text-sm font-semibold text-black">₹{(booking.visitationFee || booking.visitingCharges).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-black">Total</span>
                  <span className="text-lg font-bold text-black">₹{(booking.finalAmount || booking.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Card for Awaiting Payment */}
        {booking.status === 'awaiting_payment' && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiDollarSign className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-black">Payment Required</h3>
              <p className="text-sm text-gray-500">The vendor has accepted your request. Please choose a payment method to confirm your booking.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleOnlinePayment}
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                style={{ background: themeColors.button }}
              >
                <FiDollarSign className="w-5 h-5" />
                Pay Online (Razorpay/UPI)
              </button>

              <button
                onClick={handlePayAtHome}
                className="w-full py-4 rounded-xl font-bold text-gray-700 bg-gray-100 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <FiHome className="w-5 h-5" />
                Pay at Home (After Service)
              </button>
            </div>
          </div>
        )}

        {/* Payment Info Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">

          <h3 className="text-base font-bold text-black mb-3">Payment Information</h3>
          <div className="space-y-2">
            {booking.paymentId && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment ID</span>
                <span className="text-sm font-semibold text-black">{booking.paymentId}</span>
              </div>
            )}
            {booking.razorpayOrderId && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Order ID</span>
                <span className="text-sm font-semibold text-black">{booking.razorpayOrderId}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Status</span>
              <span className={`text-sm font-semibold ${booking.paymentStatus === 'success' ? 'text-green-600' :
                booking.paymentStatus === 'pending' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                {booking.paymentStatus === 'success' ? 'Paid' :
                  booking.paymentStatus === 'pending' ? 'Pending' :
                    booking.paymentStatus || 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Method</span>
              <span className="text-sm font-semibold text-black capitalize">{booking.paymentMethod || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Booking Date</span>
              <span className="text-sm font-semibold text-black">{formatDate(booking.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Cancel Button - Only show if booking is not cancelled or completed */}
        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            <button
              onClick={handleCancelBooking}
              className="w-full py-3.5 rounded-lg text-base font-semibold text-white transition-colors"
              style={{
                backgroundColor: '#ef4444',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              Cancel Booking
            </button>
          </div>
        )}

        {/* Rate & Review Card */}
        {(booking.status === 'work_done' || booking.status === 'completed' || booking.status === 'COMPLETED') && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            {!booking.rating ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiStar className="w-8 h-8 text-teal-600 animate-bounce transition-all duration-1000" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">How was your service?</h3>
                <p className="text-sm text-gray-500 mb-6">Your feedback helps us improve our service for everyone.</p>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="w-full py-4 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.button} 0%, #0d9488 100%)`,
                    boxShadow: `0 8px 16px ${themeColors.button}40`
                  }}
                >
                  Rate & Review Now
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                  <FiAward className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 capitalize">Your Review</h3>
                  <p className="text-xs text-gray-500 italic mt-0.5">"{booking.rating?.review || booking.review || 'No comment provided'}"</p>
                  <div className="flex items-center gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= (booking.rating?.rating || booking.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Support Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <h3 className="text-base font-bold text-black mb-3">Need Help?</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <FiPhone className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-semibold text-gray-700">Call Support</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <FiMail className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-semibold text-gray-700">Email Support</span>
            </button>
          </div>
        </div>
      </main>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          localStorage.setItem(`rating_dismissed_${id}`, 'true');
        }}
        onSubmit={handleRateSubmit}
        bookingName={booking.serviceName || booking.serviceCategory || 'Service'}
        workerName={booking.workerId?.name || (booking.assignedTo?.name === 'You (Self)' ? 'Service Provider' : (booking.assignedTo?.name || 'Worker'))}
      />

      {/* Payment Verification Modal */}
      <PaymentVerificationModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        booking={booking}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />
    </div>
  );
};

export default BookingDetails;

